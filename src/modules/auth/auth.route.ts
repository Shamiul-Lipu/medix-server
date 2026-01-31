import express, { Router } from "express";
import { authorize } from "../../middleware/auth";
import { AuthController } from "./auth.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get(
  "/me",
  authorize(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  AuthController.getUser,
);

export const AuthRouter = router;
