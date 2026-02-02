import { AdminService } from "./admin.service";
import { asyncHandler } from "../../utils/asyncHandler";
const getAllUsers = asyncHandler(async (req, res) => {
    const result = await AdminService.getAllUsers(req.query);
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});
const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const payload = req.body;
    // console.log(userId, payload);
    const result = await AdminService.updateUser(userId, payload);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
export const AdminController = {
    getAllUsers,
    updateUser,
};
//# sourceMappingURL=admin.controller.js.map