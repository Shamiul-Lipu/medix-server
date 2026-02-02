import { asyncHandler } from "../../utils/asyncHandler";
import { MedicineService } from "./medicine.service";
const getAllMedicines = asyncHandler(async (req, res) => {
    const result = await MedicineService.getAllMedicines(req.query);
    res.status(200).json({
        success: true,
        message: "Medicines fetched successfully",
        data: result,
    });
});
const getMedicineById = asyncHandler(async (req, res) => {
    const result = await MedicineService.getMedicineById(req.params.id, req.user);
    res.status(200).json({
        success: true,
        message: "Medicine fetched successfully",
        data: result,
    });
});
const createMedicine = asyncHandler(async (req, res) => {
    const result = await MedicineService.createMedicine(req.body, req.user);
    res.status(201).json({
        success: true,
        message: "Medicine created successfully",
        data: result,
    });
});
const updateMedicine = asyncHandler(async (req, res) => {
    const result = await MedicineService.updateMedicine(req.params.id, req.body, req.user);
    res.status(200).json({
        success: true,
        message: "Medicine updated successfully",
        data: result,
    });
});
const deleteMedicine = asyncHandler(async (req, res) => {
    const result = await MedicineService.deleteMedicine(req.params.id, req.user);
    res.status(200).json({
        success: true,
        message: "Medicine deleted successfully",
        data: result,
    });
});
export const MedicineController = {
    getAllMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
};
//# sourceMappingURL=medicine.controller.js.map