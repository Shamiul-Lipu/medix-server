import {
  Prisma,
  UserRole,
  OrderStatus,
  User,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";

interface UserFilters {
  page?: string;
  limit?: string;
  role?: UserRole;
  isBanned?: string;
  search?: string;
}

export const getAllUsers = async (filters: UserFilters) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filters
  const where: Prisma.UserWhereInput = {};
  if (filters.role) where.role = filters.role;
  if (filters.isBanned !== undefined)
    where.isBanned = filters.isBanned === "true";
  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: "insensitive" } },
      { name: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Fetch basic user info (without role-specific counts)
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
        isBanned: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  // Fetch role-specific counts per user
  const formattedUsers = await Promise.all(
    users.map(async (user) => {
      if (user.role === UserRole.CUSTOMER) {
        const [ordersCount, reviewsCount] = await Promise.all([
          prisma.order.count({ where: { customerId: user.id } }),
          prisma.review.count({ where: { customerId: user.id } }),
        ]);
        return {
          ...user,
          ordersCount,
          reviewsCount,
        };
      }

      if (user.role === UserRole.SELLER) {
        const [medicinesCount, ordersCount, reviewsCount] = await Promise.all([
          prisma.medicine.count({ where: { sellerId: user.id } }),
          prisma.orderItem.count({ where: { sellerId: user.id } }),
          prisma.review.count({ where: { medicine: { sellerId: user.id } } }),
        ]);
        return {
          ...user,
          medicinesCount,
          ordersCount,
          reviewsCount,
        };
      }

      // ADMIN
      return { ...user };
    }),
  );

  return {
    meta: { page, limit, total },
    users: formattedUsers,
  };
};

const controlUser = async (
  targetUserId: string,
  payload: Record<string, any>,
  admin: User,
) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
  if (!ADMIN_EMAIL) {
    throw new AppError(500, "ADMIN_EMAIL is not configured");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId.trim() },
  });

  if (!targetUser) {
    throw new AppError(404, "User not found");
  }

  if (targetUser.id === admin.id) {
    throw new AppError(400, "You cannot modify your own account");
  }

  if (targetUser.email === ADMIN_EMAIL) {
    throw new AppError(403, "Super admin cannot be modified");
  }

  const {
    id,
    userId,
    email,
    createdAt,
    updatedAt,
    sessions,
    accounts,
    ...safePayload
  } = payload;

  if (Object.keys(safePayload).length === 0) {
    throw new AppError(400, "No valid fields provided to update");
  }

  return prisma.user.update({
    where: { id: targetUser.id },
    data: safePayload,
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      phone: true,
      address: true,
      image: true,
      updatedAt: true,
    },
  });
};

const getSingleUserDetails = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId.trim() },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) throw new AppError(404, "User not found");

    let activity: any = null;

    switch (user.role) {
      case UserRole.CUSTOMER:
        activity = await getCustomerActivity(user.id);
        break;
      case UserRole.SELLER:
        activity = await getSellerActivity(user.id);
        break;
      case UserRole.ADMIN:
        activity = { note: "Admin users have no activity tracking" };
        break;
    }

    return { user, activity };
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError(500, "Failed to fetch user details");
  }
};

const getCustomerActivity = async (userId: string) => {
  try {
    const [
      totalOrders,
      cancelledOrders,
      completedOrders,
      allReviews,
      reviewsWritten,
      allOrder,
      cartItemCount,
    ] = await Promise.all([
      prisma.order.count({ where: { customerId: userId } }),
      prisma.order.count({
        where: { customerId: userId, status: OrderStatus.CANCELLED },
      }),
      prisma.order.count({
        where: { customerId: userId, status: OrderStatus.DELIVERED },
      }),
      prisma.review.findMany({
        where: { customerId: userId },
        include: {
          medicine: {
            select: {
              name: true,
              category: { select: { name: true } },
              seller: { select: { name: true } },
            },
          },
        },
      }),
      prisma.review.count({ where: { customerId: userId } }),
      prisma.order.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, totalAmount: true, createdAt: true },
      }),
      prisma.cartItem.count({ where: { customerId: userId } }),
    ]);

    return {
      type: "CUSTOMER",
      cartItemCount,
      orders: {
        total: totalOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },
      reviewsWritten,
      allReviews,
      allOrder,
    };
  } catch (err) {
    throw new AppError(500, "Failed to fetch customer activity");
  }
};

const getSellerActivity = async (userId: string) => {
  try {
    const [
      totalMedicines,
      activeMedicines,
      totalOrders,
      reviewsReceived,
      recentMedicines,
      categoriesCreated,
      deliveredOrderItems,
      cancelledOrderItems,
    ] = await Promise.all([
      prisma.medicine.count({ where: { sellerId: userId } }),
      prisma.medicine.count({ where: { sellerId: userId, isActive: true } }),
      prisma.orderItem.count({ where: { sellerId: userId } }),
      prisma.review.findMany({
        where: { medicine: { sellerId: userId } },
        select: {
          comment: true,
          rating: true,
          customer: { select: { id: true, name: true, email: true } },
          medicine: { select: { id: true, name: true } },
        },
      }),
      prisma.medicine.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
          createdAt: true,
          category: { select: { name: true } },
        },
      }),
      prisma.category.findMany({
        where: { createdById: userId },
        select: { name: true, isActive: true },
      }),

      prisma.orderItem.findMany({
        where: { sellerId: userId, order: { status: OrderStatus.DELIVERED } },
        select: {
          id: true,
          medicine: { select: { name: true } },
        },
      }),

      prisma.orderItem.findMany({
        where: { sellerId: userId, order: { status: OrderStatus.CANCELLED } },
        select: {
          id: true,
          medicine: { select: { name: true } },
        },
      }),
    ]);

    return {
      type: "SELLER",
      medicines: { total: totalMedicines, active: activeMedicines },
      orders: {
        total: totalOrders,
        delivered: deliveredOrderItems.map((item) => item.medicine.name),
        cancelled: cancelledOrderItems.map((item) => item.medicine.name),
      },
      reviewsReceived,
      recentMedicines: recentMedicines.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        isActive: m.isActive,
        createdAt: m.createdAt,
        categoryName: m.category?.name,
      })),
      categoriesCreated,
    };
  } catch (err) {
    throw new AppError(500, "Failed to fetch seller activity");
  }
};

export const AdminService = {
  getAllUsers,
  controlUser,
  getSingleUserDetails,
};
