import { UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/globalErrorHandler";
import { AuthUser } from "../../types/user.types";

interface CreateReviewPayload {
  orderItemId: string;
  medicineId: string;
  rating: number; // 1-5
  comment?: string;
}

interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

const createReview = async (payload: CreateReviewPayload, user: AuthUser) => {
  if (user.role !== UserRole.CUSTOMER) {
    throw new AppError(403, "Only customers can add reviews");
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: payload.orderItemId },
    select: {
      id: true,
      medicineId: true,
      order: {
        select: {
          customerId: true,
          status: true,
        },
      },
    },
  });

  if (!orderItem) throw new AppError(404, "Order item not found");

  if (orderItem.order.customerId !== user.id) {
    throw new AppError(403, "You can only review your own order items");
  }

  // Only delivered orders can be reviewed
  if (orderItem.order.status !== "DELIVERED") {
    throw new AppError(
      400,
      "You can add review only after the order is delivered",
    );
  }

  // Verify medicineId matches order item medicine
  if (orderItem.medicineId !== payload.medicineId) {
    throw new AppError(400, "MedicineId does not match the ordered medicine");
  }

  const existing = await prisma.review.findUnique({
    where: { orderItemId: payload.orderItemId },
  });

  if (existing) {
    throw new AppError(400, "Review already exists for this order item");
  }

  return prisma.review.create({
    data: {
      orderItemId: payload.orderItemId,
      medicineId: payload.medicineId,
      customerId: user.id,
      rating: payload.rating,
      comment: payload.comment ?? null,
    },
  });
};

const getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      customer: {
        select: { id: true, name: true },
      },
      medicine: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateReview = async (
  reviewId: string,
  payload: UpdateReviewPayload,
  user: AuthUser,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw new AppError(404, "Review not found");

  // Only owner can update
  if (review.customerId !== user.id) {
    throw new AppError(403, "You can only update your own review");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: payload.rating ?? review.rating,
      comment: payload.comment ?? review.comment,
    },
  });
};

const deleteReview = async (reviewId: string, user: AuthUser) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw new AppError(404, "Review not found");

  // Only admin or owner can delete
  if (user.role !== UserRole.ADMIN && review.customerId !== user.id) {
    throw new AppError(403, "Not authorized to delete this review");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully" };
};

export const ReviewService = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
