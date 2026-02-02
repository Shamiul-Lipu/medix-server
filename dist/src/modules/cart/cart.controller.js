import { asyncHandler } from "../../utils/asyncHandler";
import { CartService } from "./cart.service";
const getCart = asyncHandler(async (req, res) => {
    const result = await CartService.getCart(req.user);
    res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: result,
    });
});
const addItemToCart = asyncHandler(async (req, res) => {
    const result = await CartService.addItemToCart(req.body, req.user);
    res.status(201).json({
        success: true,
        message: "Item added to cart successfully",
        data: result,
    });
});
const updateCartItem = asyncHandler(async (req, res) => {
    const medicineId = req.params.medicineId;
    const quantity = req.body.quantity;
    const result = await CartService.updateCartItem(medicineId, quantity, req.user);
    res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: result,
    });
});
const removeCartItem = asyncHandler(async (req, res) => {
    const medicineId = req.params.medicineId;
    const result = await CartService.removeCartItem(medicineId, req.user);
    res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: result,
    });
});
const clearCart = asyncHandler(async (req, res) => {
    const result = await CartService.clearCart(req.user);
    res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
        data: result,
    });
});
const updateCart = asyncHandler(async (req, res) => {
    const { medicineId } = req.params;
    const { quantity } = req.body;
    const result = await CartService.updateCart(req.user, medicineId, quantity);
    res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: result,
    });
});
export const CartController = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    updateCart,
};
//# sourceMappingURL=cart.controller.js.map