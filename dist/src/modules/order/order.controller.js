import { asyncHandler } from "../../utils/asyncHandler";
import { OrderService } from "./order.service";
const createOrder = asyncHandler(async (req, res) => {
    const result = await OrderService.createOrder(req.body, req.user);
    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: result,
    });
});
const getAllOrders = asyncHandler(async (req, res) => {
    const result = await OrderService.getAllOrders(req.query, req.user);
    res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: result,
    });
});
const getOrderById = asyncHandler(async (req, res) => {
    const result = await OrderService.getOrderById(req.params.id, req.user);
    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: result,
    });
});
const updateOrderItemStatus = asyncHandler(async (req, res) => {
    const result = await OrderService.updateOrderItemStatus(req.params.itemId, req.body.status, req.user);
    res.status(200).json({
        success: true,
        message: "Order item status updated successfully",
        data: result,
    });
});
const cancelOrder = asyncHandler(async (req, res) => {
    const result = await OrderService.cancelOrder(req.params.id, req.body.reason, req.user);
    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: result,
    });
});
export const OrderController = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderItemStatus,
    cancelOrder,
};
//# sourceMappingURL=order.controller.js.map