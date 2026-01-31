import express, { Router } from "express";
import { AdminController } from "./admin.controller";
import { authorize } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/users", authorize(UserRole.ADMIN), AdminController.getAllUsers);

router.put("/users/:id", authorize(UserRole.ADMIN), AdminController.updateUser);

export const AdminRoutes = router;
