import { User, UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
import { AuthUser } from "../../types/user.types";

interface CreateCategoryPayload {
  name: string;
  description: string | null;
  isActive: boolean;
  createdById: string;
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
  const existing = await prisma.category.findFirst({
    where: {
      name: {
        equals: data.name.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existing) {
    throw new AppError(409, "Category with this name already exists");
  }

  return await prisma.category.create({
    data: {
      ...data,
      createdById: user.id,
    },
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

  if (user.role === UserRole.SELLER && category.createdById !== user.id) {
    throw new AppError(403, "You can only update categories you have created.");
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
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;

  return await prisma.category.update({
    where: { id },
    data: updateData,
  });
};

export const deleteCategory = async (categoryId: string, user: AuthUser) => {
  // Fetch category with medicines
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { medicines: true },
  });

  if (!category) throw new AppError(404, "Category not found");

  const isAdmin = user.role === UserRole.ADMIN;

  // Seller ownership check
  if (!isAdmin && category.createdById !== user.id) {
    throw new AppError(403, "You are not allowed to delete this category");
  }

  // Fetch Admin user (needed only if seller deletes and reassignment is required)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
  if (!ADMIN_EMAIL) throw new AppError(500, "Admin email not configured");

  const adminUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });
  if (!adminUser) throw new AppError(500, "Admin user not found");

  let deletedMedicines = 0;
  let reassignedMedicines = 0;

  await prisma.$transaction(async (tx) => {
    if (isAdmin) {
      // Admin deletes all medicines
      const allMedicineIds = category.medicines.map((m) => m.id);

      if (allMedicineIds.length > 0) {
        deletedMedicines = allMedicineIds.length;
        await tx.medicine.deleteMany({ where: { id: { in: allMedicineIds } } });
      }
    } else {
      // Seller deletes only their own medicines
      const sellerMedicineIds = category.medicines
        .filter((med) => med.sellerId === user.id)
        .map((med) => med.id);

      deletedMedicines = sellerMedicineIds.length;
      const otherSellerMedicines = category.medicines.filter(
        (med) => med.sellerId !== user.id,
      );

      // Delete seller's medicines
      if (sellerMedicineIds.length > 0) {
        await tx.medicine.deleteMany({
          where: { id: { in: sellerMedicineIds } },
        });
      }

      reassignedMedicines = otherSellerMedicines.length;
      // Reassign other sellers' medicines to admin category
      if (otherSellerMedicines.length > 0) {
        const adminCategory = await tx.category.create({
          data: {
            name: category.name,
            description: category.description || "",
            createdById: adminUser.id,
            isActive: category.isActive,
          },
        });

        await tx.medicine.updateMany({
          where: { id: { in: otherSellerMedicines.map((m) => m.id) } },
          data: { categoryId: adminCategory.id },
        });
      }
    }

    // Delete the category itself
    await tx.category.delete({ where: { id: categoryId } });
  });

  return { deletedMedicines, reassignedMedicines, categoryName: category.name };
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
