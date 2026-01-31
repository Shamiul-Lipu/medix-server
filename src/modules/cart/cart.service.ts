import { UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
import { AuthUser } from "../../types/user.types";

interface AddToCartPayload {
  medicineId: string;
  quantity: number;
}

const getCart = async (user: AuthUser) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { customerId: user.id },
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          manufacturer: true,
          price: true,
          stock: true,
          imageUrl: true,
          isActive: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const summary = {
    totalItems: cartItems.length,
    totalQuantity: cartItems.reduce((s, i) => s + i.quantity, 0),
    totalAmount: cartItems.reduce(
      (s, i) => s + Number(i.medicine.price) * i.quantity,
      0,
    ),
  };

  const items = cartItems.map((item) => ({
    ...item,
    isAvailable: item.medicine.isActive && item.medicine.stock >= item.quantity,
    insufficientStock: item.medicine.stock < item.quantity,
  }));

  return { items, summary };
};

const addItemToCart = async (payload: AddToCartPayload, user: AuthUser) => {
  if (!payload.quantity || payload.quantity < 1) {
    throw new AppError(400, "Quantity must be at least 1");
  }

  const medicine = await prisma.medicine.findUnique({
    where: { id: payload.medicineId },
    select: { id: true, isActive: true, stock: true },
  });

  if (!medicine) throw new AppError(404, "Medicine not found");
  if (!medicine.isActive) throw new AppError(400, "Medicine not available");
  if (medicine.stock < payload.quantity) {
    throw new AppError(400, "Insufficient stock");
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      customerId_medicineId: {
        customerId: user.id,
        medicineId: payload.medicineId,
      },
    },
  });

  if (existing) {
    const newQty = existing.quantity + payload.quantity;

    if (medicine.stock < newQty) {
      throw new AppError(400, "Insufficient stock");
    }

    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
      include: { medicine: true },
    });
  }

  return prisma.cartItem.create({
    data: {
      customerId: user.id,
      medicineId: payload.medicineId,
      quantity: payload.quantity,
    },
    include: { medicine: true },
  });
};

const updateCartItem = async (
  medicineId: string,
  quantity: number,
  user: AuthUser,
) => {
  if (!quantity || quantity < 1) {
    throw new AppError(400, "Quantity must be at least 1");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      customerId_medicineId: {
        customerId: user.id,
        medicineId,
      },
    },
    include: {
      medicine: { select: { isActive: true, stock: true } },
    },
  });

  if (!cartItem) throw new AppError(404, "Cart item not found");
  if (!cartItem.medicine.isActive)
    throw new AppError(400, "Medicine not available");
  if (cartItem.medicine.stock < quantity) {
    throw new AppError(400, "Insufficient stock");
  }

  return prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
    include: { medicine: true },
  });
};

const removeCartItem = async (medicineId: string, user: AuthUser) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      customerId_medicineId: {
        customerId: user.id,
        medicineId,
      },
    },
  });

  if (!cartItem) throw new AppError(404, "Cart item not found");

  await prisma.cartItem.delete({ where: { id: cartItem.id } });

  return { message: "Item removed from cart" };
};

const clearCart = async (user: AuthUser) => {
  const result = await prisma.cartItem.deleteMany({
    where: { customerId: user.id },
  });

  return {
    message: "Cart cleared successfully",
    itemsRemoved: result.count,
  };
};

const updateCart = async (
  user: AuthUser,
  medicineId: string,
  quantity: number,
) => {
  // Business rule: quantity must be >= 1
  if (quantity < 1) {
    throw new AppError(400, "Quantity must be at least 1");
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      customerId_medicineId: {
        customerId: user.id,
        medicineId,
      },
    },
    data: {
      quantity,
    },
  });

  return updatedItem;
};

export const CartService = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateCart,
};
