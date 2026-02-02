import express from "express";
import { authorize } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { MedicineController } from "./medicine.controller";
const router = express.Router();
router.get("/", MedicineController.getAllMedicines);
router.get("/:id", MedicineController.getMedicineById);
router.post("/", authorize(UserRole.SELLER, UserRole.ADMIN), MedicineController.createMedicine);
router.put("/:id", authorize(UserRole.SELLER, UserRole.ADMIN), MedicineController.updateMedicine);
router.delete("/:id", authorize(UserRole.SELLER, UserRole.ADMIN), MedicineController.deleteMedicine);
export const MedicineRoutes = router;
//# sourceMappingURL=medicine.route.js.map