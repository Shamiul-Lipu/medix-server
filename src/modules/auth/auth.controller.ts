import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../middleware/globalErrorHandler";

const getUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  const result = await AuthService.getUser(req.user, req.session);
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

export const AuthController = { getUser };
