import { AppError } from "../../middleware/globalErrorHandler";
import { asyncHandler } from "../../utils/asyncHandler";
import { CategoryService } from "./category.service";

const getAllCategories = asyncHandler(async (req, res) => {
  const result = await CategoryService.getAllCategories(req.query);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.createCategory(req.body, req.user!);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.updateCategory(
    req.params.id as string,
    req.body,
    req.user!,
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.deleteCategory(
    req.params.id as string,
    req.user!,
  );

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
