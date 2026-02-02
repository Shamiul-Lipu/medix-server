import { UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
const getAllUsers = async (filters) => {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.role) {
        where.role = filters.role;
    }
    if (filters.isBanned !== undefined) {
        where.isBanned = filters.isBanned === "true";
    }
    if (filters.search) {
        where.OR = [
            { email: { contains: filters.search, mode: "insensitive" } },
            { name: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                isBanned: true,
                createdAt: true,
            },
        }),
        prisma.user.count({ where }),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
        },
        users,
    };
};
const updateUser = async (id, payload) => {
    const user = await prisma.user.findFirst({
        where: { id: id.trim() },
        select: { id: true, userId: true, email: true, role: true, isBanned: true },
    });
    if (!user)
        throw new AppError(404, "User not found");
    if (user.role === UserRole.ADMIN && payload.isBanned === true) {
        throw new AppError(403, "Cannot ban admin users");
    }
    if (payload.email && payload.email !== user.email) {
        const emailExists = await prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (emailExists)
            throw new AppError(409, "Email already in use");
    }
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: payload,
        select: {
            id: true,
            userId: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            isBanned: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
};
export const AdminService = {
    getAllUsers,
    updateUser,
};
//# sourceMappingURL=admin.service.js.map