import { Router } from "express";
import { authorize } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { CartController } from "./cart.controller";

const router = Router();

router.get("/", authorize(UserRole.CUSTOMER), CartController.getCart);

router.post(
  "/items",
  authorize(UserRole.CUSTOMER),
  CartController.addItemToCart,
);

router.patch(
  "/items/:medicineId",
  authorize(UserRole.CUSTOMER),
  CartController.updateCartItem,
);

router.delete(
  "/items/:medicineId",
  authorize(UserRole.CUSTOMER),
  CartController.removeCartItem,
);

router.delete("/", authorize(UserRole.CUSTOMER), CartController.clearCart);

router.patch(
  "/items/:medicineId",
  authorize(UserRole.CUSTOMER),
  CartController.updateCartItem,
);

export const CartRoutes = router;
