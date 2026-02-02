import { OrderStatus, UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
const createOrder = async (payload, user) => {
    if (!payload.items || payload.items.length === 0) {
        throw new AppError(400, "Order must contain at least one item");
    }
    return await prisma.$transaction(async (tx) => {
        const orderItems = [];
        let totalAmount = 0;
        // 1. Validate medicines, check stock, and prepare order items
        for (const item of payload.items) {
            const medicine = await tx.medicine.findUnique({
                where: { id: item.medicineId },
                select: {
                    id: true,
                    name: true,
                    manufacturer: true,
                    price: true,
                    stock: true,
                    isActive: true,
                    sellerId: true,
                },
            });
            if (!medicine) {
                throw new AppError(404, `Medicine not found: ${item.medicineId}`);
            }
            if (!medicine.isActive) {
                throw new AppError(400, `Medicine "${medicine.name}" is not available`);
            }
            if (medicine.stock < item.quantity) {
                throw new AppError(400, `Insufficient stock for "${medicine.name}". Available: ${medicine.stock}, Requested: ${item.quantity}`);
            }
            if (item.quantity <= 0) {
                throw new AppError(400, "Quantity must be greater than 0");
            }
            const subtotal = Number(medicine.price) * item.quantity;
            totalAmount += subtotal;
            // Add items to the orderItems array, without the 'status' field
            orderItems.push({
                medicineId: medicine.id,
                sellerId: medicine.sellerId,
                medicineNameSnapshot: medicine.name,
                manufacturerSnapshot: medicine.manufacturer,
                priceSnapshot: medicine.price,
                quantity: item.quantity,
                subtotal,
            });
            // 2. Reduce stock for the medicine
            await tx.medicine.update({
                where: { id: medicine.id },
                data: { stock: { decrement: item.quantity } },
            });
        }
        // 3. Create the order in the database
        const order = await tx.order.create({
            data: {
                customerId: user.id,
                totalAmount,
                paymentMethod: "COD",
                status: OrderStatus.PLACED, // Set status for the order
                shippingName: payload.shippingName,
                shippingPhone: payload.shippingPhone,
                shippingAddress: payload.shippingAddress,
                notes: payload.notes || null,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        medicine: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });
        // 4. Clear customer's cart after order is created
        await tx.cartItem.deleteMany({
            where: { customerId: user.id },
        });
        return order;
    });
};
const getAllOrders = async (filters, user) => {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {};
    if (user.role === UserRole.CUSTOMER) {
        where.customerId = user.id;
    }
    else if (user.role === UserRole.SELLER) {
        where.items = {
            some: { sellerId: user.id },
        };
    }
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
            where.createdAt.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            where.createdAt.lte = new Date(filters.endDate);
        }
    }
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                totalAmount: true,
                status: true, // This is still needed at the Order level
                paymentMethod: true,
                shippingName: true,
                shippingPhone: true,
                shippingAddress: true,
                createdAt: true,
                deliveredAt: true,
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: user.role === UserRole.SELLER
                    ? {
                        where: { sellerId: user.id },
                        select: {
                            id: true,
                            medicineNameSnapshot: true,
                            quantity: true,
                            priceSnapshot: true,
                            subtotal: true,
                        },
                    }
                    : {
                        select: {
                            id: true,
                            medicineNameSnapshot: true,
                            quantity: true,
                            priceSnapshot: true,
                            subtotal: true,
                        },
                    },
            },
        }),
        prisma.order.count({ where }),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        orders,
    };
};
const getOrderById = async (orderId, user) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            items: {
                include: {
                    medicine: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    if (!order) {
        throw new AppError(404, "Order not found");
    }
    if (user.role === UserRole.CUSTOMER && order.customerId !== user.id) {
        throw new AppError(403, "You can only view your own orders");
    }
    if (user.role === UserRole.SELLER) {
        // Filter to show only seller's items
        const sellerItems = order.items.filter((item) => item.sellerId === user.id);
        if (sellerItems.length === 0) {
            throw new AppError(403, "This order does not contain your items");
        }
        order.items = sellerItems;
    }
    return order;
};
const updateOrderItemStatus = async (itemId, newStatus, // Now working with OrderStatus instead of OrderItemStatus
user) => {
    const orderItem = await prisma.orderItem.findUnique({
        where: { id: itemId },
        include: {
            order: true, // Include the order itself to check the overall order status
        },
    });
    if (!orderItem) {
        throw new AppError(404, "Order item not found");
    }
    // Seller can only update own items
    if (user.role === UserRole.SELLER && orderItem.sellerId !== user.id) {
        throw new AppError(403, "You can only update your own order items");
    }
    // Ensure that the seller is not updating after an item is shipped
    if (user.role === UserRole.SELLER &&
        orderItem.order.status === OrderStatus.SHIPPED) {
        throw new AppError(403, "Cannot update item after the order has been shipped");
    }
    // Update the order status
    const updatedOrder = await prisma.order.update({
        where: { id: orderItem.orderId },
        data: { status: newStatus },
    });
    // Check if all items in the order are delivered or cancelled
    const allItems = await prisma.orderItem.findMany({
        where: { orderId: orderItem.orderId },
    });
    // const allDelivered = allItems.every(
    //   (item) => item.status === OrderStatus.DELIVERED, // Check for item-level delivered status
    // );
    // const allCancelled = allItems.every(
    //   (item) => item.status === OrderStatus.CANCELLED, // Check for item-level cancelled status
    // );
    // Update the order status to DELIVERED or CANCELLED based on the items
    // if (allDelivered) {
    //   await prisma.order.update({
    //     where: { id: orderItem.orderId },
    //     data: {
    //       status: OrderStatus.DELIVERED,
    //       deliveredAt: new Date(),
    //     },
    //   });
    // } else if (allCancelled) {
    //   await prisma.order.update({
    //     where: { id: orderItem.orderId },
    //     data: { status: OrderStatus.CANCELLED },
    //   });
    // }
    return updatedOrder;
};
const cancelOrder = async (orderId, reason, user) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
        },
    });
    if (!order) {
        throw new AppError(404, "Order not found");
    }
    // Customer can only cancel own orders
    if (user.role === UserRole.CUSTOMER && order.customerId !== user.id) {
        throw new AppError(403, "You can only cancel your own orders");
    }
    // Sellers cannot cancel orders
    if (user.role === UserRole.SELLER) {
        throw new AppError(403, "Sellers cannot cancel orders");
    }
    // Check if order can be cancelled
    const canCancelStatuses = [
        OrderStatus.PLACED,
        OrderStatus.PROCESSING,
    ];
    // We now know that `order.status` is a valid `OrderStatus`, and this check works
    if (user.role === UserRole.CUSTOMER &&
        !canCancelStatuses.includes(order.status)) {
        throw new AppError(400, "Cannot cancel order after it has been shipped");
    }
    // Restore stock for all items
    await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
            await tx.medicine.update({
                where: { id: item.medicineId },
                data: { stock: { increment: item.quantity } },
            });
        }
        // Update the order status to CANCELLED
        await tx.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.CANCELLED,
                notes: reason ? `Cancelled: ${reason}` : order.notes,
            },
        });
    });
    return { message: "Order cancelled successfully" };
};
export const OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderItemStatus,
    cancelOrder,
};
//# sourceMappingURL=order.service.js.map