const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    createBy: {
        type: String,
        require: true,
        trim: true
    },
    cost: {
        amount: { type: Number, required: true },
        currency: { type: String, enum: ["VND", "USD"], required: true },
        discount: {
            type: Number,
            default: 0
        },
    },
    shop_id: { type: String, require: true },
    rate: { type: Number, default: 0, min: 0, max: 5 },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String, default: ""
    },
    imageUrls: {
        type: [String],
        default: [],
    },
    dimension: {
        weight: { type: Number, require: true, min: 1 },
        length: { type: Number, require: true, min: 1 },
        width: { type: Number, require: true, min: 1 },
        height: { type: Number, require: true, min: 1 },
    },
    size: {
        type: Map,
        of: Number // The values will be numbers (quantities)
    },
    isApproved: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
