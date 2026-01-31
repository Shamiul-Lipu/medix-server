import { Prisma, UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
import { AuthUser } from "../../types/user.types";
import { getRandomImage } from "../../utils/getRandomImage";

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

const getAllMedicines = async (params: GetAllMedicinesParams = {}) => {
  const page = Math.max(params.page || 1, 1);
  const limit = Math.max(params.limit || 10, 1);
  const skip = params.skip ?? (page - 1) * limit;

  const andConditions: Prisma.MedicineWhereInput[] = [{ isActive: true }];

  // Filters
  if (params.search) {
    andConditions.push({
      OR: [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { manufacturer: { contains: params.search, mode: "insensitive" } },
      ],
    });
  }

  if (params.categoryId) andConditions.push({ categoryId: params.categoryId });

  if (params.manufacturer) {
    andConditions.push({
      manufacturer: { contains: params.manufacturer, mode: "insensitive" },
    });
  }

  if (params.minPrice || params.maxPrice) {
    andConditions.push({
      price: {
        ...(params.minPrice !== undefined && {
          gte: new Prisma.Decimal(params.minPrice),
        }),
        ...(params.maxPrice !== undefined && {
          lte: new Prisma.Decimal(params.maxPrice),
        }),
      },
    });
  }

  if (params.minStock || params.maxStock) {
    andConditions.push({
      stock: {
        ...(params.minStock !== undefined && { gte: params.minStock }),
        ...(params.maxStock !== undefined && { lte: params.maxStock }),
      },
    });
  }

  // Sorting
  const orderBy: Prisma.MedicineOrderByWithRelationInput = {};
  if (params.sortBy) orderBy[params.sortBy] = params.sortOrder || "desc";
  else orderBy.createdAt = "desc";

  // Fetch data
  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where: { AND: andConditions },
      take: limit,
      skip,
      orderBy,
      include: {
        category: true,
        seller: true,
      },
    }),
    prisma.medicine.count({ where: { AND: andConditions } }),
  ]);

  return {
    data: medicines,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMedicineById = async (id: string, user?: AuthUser) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        where: { orderItem: { status: "DELIVERED" } },
        select: {
          id: true,
          rating: true,
          comment: true,
          customer: {
            select: {
              name: true,
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!medicine) {
    throw new AppError(404, "Medicine not found");
  }

  if (!user || user.role === UserRole.CUSTOMER) {
    if (!medicine.isActive) {
      throw new AppError(404, "Medicine not found");
    }
  }

  if (user?.role === UserRole.SELLER && medicine.sellerId !== user.id) {
    throw new AppError(403, "You can only view your own medicines");
  }

  return medicine;
};

const createMedicine = async (
  payload: CreateMedicinePayload,
  user: AuthUser,
) => {
  // Validate category exists
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  // Sellers can only create for themselves
  const sellerId = user.role === UserRole.SELLER ? user.id : user.id;

  const imageUrl =
    getRandomImage() ?? "https://i.ibb.co.com/0jLd1HNq/product-6.jpg";

  return await prisma.medicine.create({
    data: {
      sellerId,
      categoryId: payload.categoryId,
      name: payload.name,
      description: payload.description || null,
      manufacturer: payload.manufacturer,
      price: payload.price,
      stock: payload.stock,
      dosageForm: payload.dosageForm || null,
      strength: payload.strength || null,
      usageInstructions: payload.usageInstructions || null,
      sideEffects: payload.sideEffects || null,
      imageUrl,
      isActive: payload.isActive ?? true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const updateMedicine = async (
  id: string,
  payload: UpdateMedicinePayload,
  user: AuthUser,
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
  });

  if (!medicine) {
    throw new AppError(404, "Medicine not found");
  }

  if (user.role === UserRole.SELLER && medicine.sellerId !== user.id) {
    throw new AppError(403, "You can only update your own medicines");
  }

  // Validate category if changing
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new AppError(404, "Category not found");
    }
  }

  // Build update data dynamically (removes undefined values)
  const updateData = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined),
  );

  return await prisma.medicine.update({
    where: { id },
    data: updateData,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const deleteMedicine = async (id: string, user: AuthUser) => {
  // Check if medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id },
  });

  if (!medicine) {
    throw new AppError(404, "Medicine not found");
  }

  // Seller can only delete own medicines
  if (user.role === UserRole.SELLER && medicine.sellerId !== user.id) {
    throw new AppError(403, "You can only delete your own medicines");
  }

  // Check if medicine is in any active orders
  const activeOrderItems = await prisma.orderItem.count({
    where: {
      medicineId: id,
      status: {
        in: ["PLACED", "PROCESSING", "SHIPPED"],
      },
    },
  });

  if (activeOrderItems > 0) {
    throw new AppError(
      400,
      `Cannot delete medicine with ${activeOrderItems} active orders. Deactivate instead.`,
    );
  }

  // Soft delete (set isActive to false)
  return await prisma.medicine.update({
    where: { id },
    data: { isActive: false },
  });
};

export const MedicineService = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
