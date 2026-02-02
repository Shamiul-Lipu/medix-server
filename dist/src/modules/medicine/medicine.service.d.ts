import { Prisma, UserRole } from "../../../generated/prisma/client";
import { AuthUser } from "../../types/user.types";
interface GetAllMedicinesParams {
    search?: string;
    categoryId?: string;
    manufacturer?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    page?: number;
    limit?: number;
    skip?: number;
    sortBy?: keyof Prisma.MedicineOrderByWithRelationInput;
    sortOrder?: "asc" | "desc";
}
interface CreateMedicinePayload {
    categoryId: string;
    name: string;
    description?: string;
    manufacturer: string;
    price: number;
    stock: number;
    dosageForm?: string;
    strength?: string;
    usageInstructions?: string;
    sideEffects?: string;
    imageUrl?: string;
    isActive?: boolean;
}
interface UpdateMedicinePayload {
    categoryId?: string;
    name?: string;
    description?: string;
    manufacturer?: string;
    price?: number;
    stock?: number;
    dosageForm?: string;
    strength?: string;
    usageInstructions?: string;
    sideEffects?: string;
    imageUrl?: string;
    isActive?: boolean;
}
export declare const MedicineService: {
    getAllMedicines: (params?: GetAllMedicinesParams) => Promise<{
        data: ({
            seller: {
                role: UserRole;
                phone: string | null;
                address: string | null;
                isBanned: boolean;
                email: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                name: string;
                image: string | null;
                emailVerified: boolean;
            };
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
            };
        } & {
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMedicineById: (id: string, user?: AuthUser) => Promise<{
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
    }>;
    createMedicine: (payload: CreateMedicinePayload, user: AuthUser) => Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
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
    }>;
    updateMedicine: (id: string, payload: UpdateMedicinePayload, user: AuthUser) => Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
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
    }>;
    deleteMedicine: (id: string, user: AuthUser) => Promise<{
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
    }>;
};
export {};
//# sourceMappingURL=medicine.service.d.ts.map