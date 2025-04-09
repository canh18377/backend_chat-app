const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
    createBy: { type: String, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    ward_code: { type: String, required: true },
    district_id: { type: Number, required: true },
    avatar: { type: String, require: true },
    background: { type: String, require: true },
    shop_id: { type: Number, required: true, unique: true }, // ID từ GHN
    product: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    follower: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);
