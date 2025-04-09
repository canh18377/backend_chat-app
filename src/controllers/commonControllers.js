const { statusCode, responseCode, message, sendResponse } = require('../utils/responseCode');
const ProductShema = require("../models/product");

class CommonController {
    async toggleApproval(req, res) {
        try {
            const { _id, checked } = req.body;
            if (req.user.role !== "admin") {
                return sendResponse(res, responseCode.forbidden, statusCode.fail, {}, "You don't have permission to perform this action.");
            }
            const updatedProduct = await ProductShema.findOneAndUpdate(
                { _id: _id },
                { isApproved: checked },
                { new: true }
            );
            const response = {
                type: "product",
                updatedProduct: updatedProduct
            }
            if (!updatedProduct) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Product not found.");
            }
            return sendResponse(res, responseCode.success, statusCode.success, response, "Product approval status updated successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }
}

module.exports = new CommonController();
