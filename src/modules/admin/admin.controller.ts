import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../../generated/prisma/client";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const controlUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const admin = req.user;

  if (!admin) {
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: null,
    });
  }

  const result = await AdminService.controlUser(
    userId as string,
    payload,
    admin as User,
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const getSingleUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await AdminService.getSingleUserDetails(userId as string);

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: result,
    });
  },
);

export const AdminController = {
  getAllUsers,
  controlUser,
  getSingleUserDetails,
};
