import { Router } from "express";
import { OrderController } from "./order.controller";
import { authorize } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", authorize(UserRole.CUSTOMER), OrderController.createOrder);

router.put(
  "/:id/cancel",
  authorize(UserRole.CUSTOMER, UserRole.ADMIN),
  OrderController.cancelOrder,
);

router.get(
  "/",
  authorize(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  OrderController.getAllOrders,
);

router.get(
  "/:id",
  authorize(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  OrderController.getOrderById,
);

router.put(
  "/items/:itemId/status",
  authorize(UserRole.SELLER, UserRole.ADMIN),
  OrderController.updateOrderItemStatus,
);

export const OrderRoutes = router;
