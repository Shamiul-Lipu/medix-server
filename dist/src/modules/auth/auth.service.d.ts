import { UserRole } from "../../../generated/prisma/enums";
export declare const AuthService: {
    getUser: (user: {
        id: string;
        email: string;
        name: string;
        role: string;
        isBanned: boolean;
    }, session?: any) => Promise<{
        user: {
            role: UserRole;
            phone: string | null;
            address: string | null;
            isBanned: boolean;
            email: string;
            id: string;
            createdAt: Date;
            name: string;
            image: string | null;
        };
        dashboard: {
            totalOrders: number;
            cartItems: number;
            reviewsGiven: number;
            recentOrders: {
                id: string;
                createdAt: Date;
                totalAmount: import("@prisma/client-runtime-utils").Decimal;
                status: import("../../../generated/prisma/enums").OrderStatus;
            }[];
            totalMedicines?: never;
            lowStockMedicines?: never;
            pendingOrders?: never;
            recentOrderItems?: never;
            totalUsers?: never;
            totalCustomers?: never;
            totalSellers?: never;
            recentUsers?: never;
        };
    } | {
        user: {
            role: UserRole;
            phone: string | null;
            address: string | null;
            isBanned: boolean;
            email: string;
            id: string;
            createdAt: Date;
            name: string;
            image: string | null;
        };
        dashboard: {
            totalMedicines: number;
            lowStockMedicines: number;
            pendingOrders: number;
            recentOrderItems: {
                id: string;
                order: {
                    id: string;
                    createdAt: Date;
                };
                medicineNameSnapshot: string;
                quantity: number;
                subtotal: import("@prisma/client-runtime-utils").Decimal;
            }[];
            totalOrders?: never;
            cartItems?: never;
            reviewsGiven?: never;
            recentOrders?: never;
            totalUsers?: never;
            totalCustomers?: never;
            totalSellers?: never;
            recentUsers?: never;
        };
    } | {
        user: {
            role: UserRole;
            phone: string | null;
            address: string | null;
            isBanned: boolean;
            email: string;
            id: string;
            createdAt: Date;
            name: string;
            image: string | null;
        };
        dashboard: {
            totalUsers: number;
            totalCustomers: number;
            totalSellers: number;
            totalOrders: number;
            totalMedicines: number;
            recentUsers: {
                role: UserRole;
                id: string;
                createdAt: Date;
                name: string;
            }[];
            cartItems?: never;
            reviewsGiven?: never;
            recentOrders?: never;
            lowStockMedicines?: never;
            pendingOrders?: never;
            recentOrderItems?: never;
        };
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map