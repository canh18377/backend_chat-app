const mongoose = require('mongoose');

// Schema cho giỏ hàng (cart)
const cartSchema = new mongoose.Schema({
  idUser: { type: String, ref: 'user', required: true }, // Người dùng thêm sản phẩm vào giỏ hàng
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true }, // ID của sản phẩm
      quantity: { type: Number, default: 1 }, // Số lượng sản phẩm
      cost: { amount: { type: Number, required: true }, currency: { type: String, required: true } }, // Giá sản phẩm tại thời điểm thêm vào giỏ
      imageUrls: { type: [String], require: true },
      name: { type: String, require: true },
      shop_id: { type: Number, require: true },
      size: { type: String, default: null }
    }
  ],
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo giỏ hàng
  updatedAt: { type: Date, default: Date.now } // Thời gian cập nhật giỏ hàng
});
cartSchema.path('items').options._id = false;
const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart
