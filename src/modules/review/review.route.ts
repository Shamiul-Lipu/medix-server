import { Router } from "express";
import { authorize } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { ReviewController } from "./review.controller";

const router = Router();

router.get("/", ReviewController.getAllReviews);

router.post("/", authorize(UserRole.CUSTOMER), ReviewController.createReview);

router.patch(
  "/:reviewId",
  authorize(UserRole.CUSTOMER),
  ReviewController.updateReview,
);

router.delete(
  "/:reviewId",
  authorize(UserRole.CUSTOMER, UserRole.ADMIN),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;
