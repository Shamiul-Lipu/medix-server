import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CategoryRoutes } from "../modules/category/category.routes";
import { MedicineRoutes } from "../modules/medicine/medicine.route";
import { OrderRoutes } from "../modules/order/order.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { ReviewRoutes } from "../modules/review/review.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/admin", AdminRoutes);
router.use("/category", CategoryRoutes);
router.use("/medicine", MedicineRoutes);
router.use("/order", OrderRoutes);
router.use("/cart", CartRoutes);
router.use("/review", ReviewRoutes);

export const allApiRoutes = router;
