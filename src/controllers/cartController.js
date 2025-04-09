const { statusCode, responseCode, sendResponse } = require('../utils/responseCode');
const Cart = require("../models/cart");
const Product = require("../models/product");

class CartController {
    async getCart(req, res) {
        try {
            const cart = await Cart.findOne({ idUser: req.user.idUser })
            if (!cart) {
                return sendResponse(res, responseCode.success, statusCode.success, {}, "Cart not found.");
            }

            return sendResponse(res, responseCode.success, statusCode.success, cart, "Cart fetched successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(req, res) {
        try {
            const { id, cartAmount } = req.body;
            const product = await Product.findById(id);

            if (!product) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Product not found.");
            }

            let cart = await Cart.findOne({ idUser: req.user.idUser });
            const price = product.cost.amount * Math.round((1 - product.cost.discount) * 100) / 100
            // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
            if (!cart) {
                cart = new Cart({
                    idUser: req.user.idUser,
                    items: [
                        {
                            shop_id: product.shop_id,
                            productId: id,
                            quantity: cartAmount,
                            cost: { amount: price, currency: product.cost.currency },
                            imageUrls: product.imageUrls,
                            name: product.name,
                            size: req.body.selectedSize
                        }
                    ]
                });
            } else {
                // Nếu giỏ hàng đã tồn tại, kiểm tra xem sản phẩm đã có trong giỏ hay chưa
                const productIndex = cart.items.findIndex(item => item.productId.toString() === id.toString());
                if (productIndex > -1) {
                    // Nếu có, cập nhật số lượng sản phẩm trong giỏ
                    cart.items[productIndex].quantity += cartAmount;
                    if (req.body.selectedSize) {
                        cart.items[productIndex].size = req.body.selectedSize;
                    }
                } else {
                    // Nếu chưa có, thêm sản phẩm mới vào giỏ
                    cart.items.push({
                        shop_id: product.shop_id,
                        productId: id,
                        quantity: cartAmount,
                        cost: { amount: price, currency: product.cost.currency },
                        imageUrls: product.imageUrls,
                        name: product.name,
                        size: req.body.selectedSize
                    });
                }
            }

            cart.updatedAt = Date.now();
            await cart.save();

            return sendResponse(res, responseCode.created, statusCode.success, cart, "Product added to cart successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCart(req, res) {
        try {
            const { productId, quantity } = req.body;

            const cart = await Cart.findOne({ userId: req.user._id });
            if (!cart) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Cart not found.");
            }

            const productIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
            if (productIndex === -1) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Product not in cart.");
            }

            // Cập nhật số lượng sản phẩm trong giỏ
            cart.items[productIndex].quantity = quantity;
            cart.updatedAt = Date.now();
            await cart.save();

            return sendResponse(res, responseCode.success, statusCode.success, cart, "Cart updated successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(req, res) {
        try {
            const { productId } = req.params;
            const cart = await Cart.findOne({ idUser: req.user.idUser });

            if (!cart) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Cart not found.");
            }

            // Tìm và xóa sản phẩm trong giỏ
            cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());
            cart.updatedAt = Date.now();
            await cart.save();

            return sendResponse(res, responseCode.success, statusCode.success, cart, "Product removed from cart successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart(req, res) {
        try {
            const cart = await Cart.findOne({ userId: req.user._id });
            if (!cart) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Cart not found.");
            }

            cart.items = [];
            cart.updatedAt = Date.now();
            await cart.save();

            return sendResponse(res, responseCode.success, statusCode.success, {}, "Cart cleared successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }
}

module.exports = new CartController();
