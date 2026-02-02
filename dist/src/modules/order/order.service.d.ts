import { OrderStatus } from "../../../generated/prisma/enums";
import { AuthUser } from "../../types/user.types";
interface OrderFilters {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    page?: string;
    limit?: string;
}
interface CreateOrderPayload {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    notes?: string;
    items: {
        medicineId: string;
        quantity: number;
    }[];
}
export declare const OrderService: {
    createOrder: (payload: CreateOrderPayload, user: AuthUser) => Promise<{
        items: ({
            medicine: {
                id: string;
                name: string;
                imageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sellerId: string;
            orderId: string;
            medicineId: string;
            medicineNameSnapshot: string;
            manufacturerSnapshot: string | null;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("../../../generated/prisma/enums").PaymentMethod;
        status: OrderStatus;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        notes: string | null;
        deliveredAt: Date | null;
    }>;
    getAllOrders: (filters: OrderFilters, user: AuthUser) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        orders: {
            id: string;
            createdAt: Date;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: "COD";
            status: OrderStatus;
            shippingName: string;
            shippingPhone: string;
            shippingAddress: string;
            deliveredAt: Date | null;
            customer: {
                email: string;
                id: string;
                name: string;
            };
            items: ({
                id: string;
                medicineNameSnapshot: string;
                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                subtotal: import("@prisma/client-runtime-utils").Decimal;
            } | {
                id: string;
                medicineNameSnapshot: string;
                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                subtotal: import("@prisma/client-runtime-utils").Decimal;
            })[];
        }[];
    }>;
    getOrderById: (orderId: string, user: AuthUser) => Promise<{
        customer: {
            phone: string | null;
            email: string;
            id: string;
            name: string;
        };
        items: ({
            medicine: {
                id: string;
                name: string;
                imageUrl: string | null;
            };
            seller: {
                email: string;
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sellerId: string;
            orderId: string;
            medicineId: string;
            medicineNameSnapshot: string;
            manufacturerSnapshot: string | null;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("../../../generated/prisma/enums").PaymentMethod;
        status: OrderStatus;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        notes: string | null;
        deliveredAt: Date | null;
    }>;
    updateOrderItemStatus: (itemId: string, newStatus: OrderStatus, user: AuthUser) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("../../../generated/prisma/enums").PaymentMethod;
        status: OrderStatus;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        notes: string | null;
        deliveredAt: Date | null;
    }>;
    cancelOrder: (orderId: string, reason: string | undefined, user: AuthUser) => Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=order.service.d.ts.map