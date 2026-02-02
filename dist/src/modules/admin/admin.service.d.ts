import { UserRole } from "../../../generated/prisma/client";
interface UserFilters {
    role?: UserRole;
    isBanned?: string;
    search?: string;
    page?: string;
    limit?: string;
}
interface UpdateUserPayload {
    name?: string;
    email?: string;
    role?: UserRole;
    phone?: string;
    address?: string;
    isBanned?: boolean;
}
export declare const AdminService: {
    getAllUsers: (filters: UserFilters) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        users: {
            role: UserRole;
            phone: string | null;
            isBanned: boolean;
            email: string;
            id: string;
            createdAt: Date;
            userId: string;
            name: string;
        }[];
    }>;
    updateUser: (id: string, payload: UpdateUserPayload) => Promise<{
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
    }>;
};
export {};
//# sourceMappingURL=admin.service.d.ts.map