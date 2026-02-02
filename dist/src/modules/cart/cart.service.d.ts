import { AuthUser } from "../../types/user.types";
interface AddToCartPayload {
    medicineId: string;
    quantity: number;
}
export declare const CartService: {
    getCart: (user: AuthUser) => Promise<{
        items: {
            isAvailable: boolean;
            insufficientStock: boolean;
            medicine: {
                id: string;
                name: string;
                category: {
                    id: string;
                    name: string;
                };
                isActive: boolean;
                manufacturer: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stock: number;
                imageUrl: string | null;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            medicineId: string;
            quantity: number;
        }[];
        summary: {
            totalItems: number;
            totalQuantity: number;
            totalAmount: number;
        };
    }>;
    addItemToCart: (payload: AddToCartPayload, user: AuthUser) => Promise<{
        medicine: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sellerId: string;
            description: string | null;
            isActive: boolean;
            categoryId: string;
            manufacturer: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            dosageForm: string | null;
            strength: string | null;
            usageInstructions: string | null;
            sideEffects: string | null;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        medicineId: string;
        quantity: number;
    }>;
    updateCartItem: (medicineId: string, quantity: number, user: AuthUser) => Promise<{
        medicine: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sellerId: string;
            description: string | null;
            isActive: boolean;
            categoryId: string;
            manufacturer: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            dosageForm: string | null;
            strength: string | null;
            usageInstructions: string | null;
            sideEffects: string | null;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        medicineId: string;
        quantity: number;
    }>;
    removeCartItem: (medicineId: string, user: AuthUser) => Promise<{
        message: string;
    }>;
    clearCart: (user: AuthUser) => Promise<{
        message: string;
        itemsRemoved: number;
    }>;
    updateCart: (user: AuthUser, medicineId: string, quantity: number) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        medicineId: string;
        quantity: number;
    }>;
};
export {};
//# sourceMappingURL=cart.service.d.ts.map