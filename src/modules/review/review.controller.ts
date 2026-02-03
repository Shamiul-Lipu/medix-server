import { asyncHandler } from "../../utils/asyncHandler";
import { ReviewService } from "./review.service";

const createReview = asyncHandler(async (req, res) => {
  const result = await ReviewService.createReview(req.body, req.user!);

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const result = await ReviewService.getAllReviews();

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId as string;

  const result = await ReviewService.updateReview(
    reviewId,
    req.body,
    req.user!,
  );

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId as string;

  const result = await ReviewService.deleteReview(reviewId, req.user!);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
