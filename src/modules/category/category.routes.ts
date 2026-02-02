import express, { Router } from "express";
import { CategoryController } from "./category.controller";
import { authorize } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);

router.post(
  "/",
  authorize(UserRole.ADMIN, UserRole.SELLER),
  CategoryController.createCategory,
);

router.put(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.SELLER),
  CategoryController.updateCategory,
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.SELLER),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
