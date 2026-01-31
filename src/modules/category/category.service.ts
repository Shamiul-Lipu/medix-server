import { User, UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
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

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const createCategory = async (data: CreateCategoryPayload, user: AuthUser) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError(409, "Category with this name already exists");
  }

  return await prisma.category.create({
    data,
  });
};

const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload,
  user: AuthUser,
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (payload.name && payload.name !== category.name) {
    const duplicate = await prisma.category.findUnique({
      where: { name: payload.name },
    });

    if (duplicate) {
      throw new AppError(409, "Category with this name already exists");
    }
  }

  // Build update data
  const updateData: any = {};

  if (payload.name) updateData.name = payload.name;
  if (payload.description !== undefined)
    updateData.description = payload.description;

  // Only admins can change isActive status
  if (payload.isActive !== undefined) {
    if (user.role !== UserRole.ADMIN) {
      throw new AppError(403, "Only admins can change category status");
    }
    updateData.isActive = payload.isActive;
  }

  return await prisma.category.update({
    where: { id },
    data: updateData,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  // Check if category has medicines
  const medicineCount = await prisma.medicine.count({
    where: { categoryId: id },
  });

  if (medicineCount > 0) {
    throw new AppError(
      400,
      `Cannot delete category with ${medicineCount} associated medicines. Deactivate instead.`,
    );
  }

  // Soft delete (set isActive to false)
  return await prisma.category.update({
    where: { id },
    data: { isActive: false },
  });
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
