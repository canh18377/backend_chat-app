const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/cartController');
router.get('/', CartController.getCart);
// Thêm sản phẩm vào giỏ hàng
router.post('/', CartController.addToCart);
// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/', CartController.updateCart);
// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:productId', CartController.removeFromCart);
// Xóa toàn bộ giỏ hàng
router.delete('/clear', CartController.clearCart);
module.exports = router;
