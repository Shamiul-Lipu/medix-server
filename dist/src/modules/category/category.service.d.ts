import { AuthUser } from "../../types/user.types";
interface CreateCategoryPayload {
    name: string;
    description?: string;
}
interface UpdateCategoryPayload {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export declare const CategoryService: {
    getAllCategories: () => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }[]>;
    createCategory: (data: CreateCategoryPayload, user: AuthUser) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    updateCategory: (id: string, payload: UpdateCategoryPayload, user: AuthUser) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    deleteCategory: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
};
export {};
//# sourceMappingURL=category.service.d.ts.map