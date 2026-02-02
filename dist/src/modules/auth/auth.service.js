import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
const getUser = async (user, session) => {
    const { id, role } = user;
    /**
     * COMMON USER BASE (shared by all roles)
     */
    const baseUser = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            image: true,
            isBanned: true,
            createdAt: true,
        },
    });
    if (!baseUser) {
        throw new AppError(404, "User not found");
    }
    /**
     * ROLE-BASED BUSINESS LOGIC
     * -------------------------
     * Everything lives here as requested.
     */
    if (role === UserRole.CUSTOMER) {
        const [orderCount, cartCount, reviewCount, recentOrders] = await Promise.all([
            prisma.order.count({
                where: { customerId: id },
            }),
            prisma.cartItem.count({
                where: { customerId: id },
            }),
            prisma.review.count({
                where: { customerId: id },
            }),
            prisma.order.findMany({
                where: { customerId: id },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            user: baseUser,
            dashboard: {
                totalOrders: orderCount,
                cartItems: cartCount,
                reviewsGiven: reviewCount,
                recentOrders,
            },
        };
    }
    if (role === UserRole.SELLER) {
        const [medicineCount, lowStockCount, pendingOrderItems, recentOrderItems] = await Promise.all([
            prisma.medicine.count({
                where: { sellerId: id },
            }),
            prisma.medicine.count({
                where: {
                    sellerId: id,
                    stock: { lte: 5 },
                },
            }),
            prisma.orderItem.count({
                where: {
                    sellerId: id,
                },
            }),
            prisma.orderItem.findMany({
                where: { sellerId: id },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    quantity: true,
                    subtotal: true,
                    order: {
                        select: {
                            id: true,
                            createdAt: true,
                        },
                    },
                    medicineNameSnapshot: true,
                },
            }),
        ]);
        return {
            user: baseUser,
            dashboard: {
                totalMedicines: medicineCount,
                lowStockMedicines: lowStockCount,
                pendingOrders: pendingOrderItems,
                recentOrderItems,
            },
        };
    }
    if (role === UserRole.ADMIN) {
        const [totalUsers, totalCustomers, totalSellers, totalOrders, totalMedicines, recentUsers,] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
            prisma.user.count({ where: { role: UserRole.SELLER } }),
            prisma.order.count(),
            prisma.medicine.count(),
            prisma.user.findMany({
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            user: baseUser,
            dashboard: {
                totalUsers,
                totalCustomers,
                totalSellers,
                totalOrders,
                totalMedicines,
                recentUsers,
            },
        };
    }
    throw new AppError(404, "Unsupported user role");
};
export const AuthService = { getUser };
//# sourceMappingURL=auth.service.js.map