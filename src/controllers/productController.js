const productSchema = require('../models/product');
const fs = require("fs")
const shopShema = require("../models/shop")
const {
    responseCode,
    statusCode,
    responseMessage,
    sendResponse
} = require('../utils/responseCode');
const cloudinary = require("../config/cloudinary")
const { uploadImage, uploadVideo } = require('../utils/upload_to_cloudinary')
// Tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        const { idUser } = req.user;
        const { name, size, width, height, length, weight, category, quantity, description, currency, amount, discount } = req.body;
        // Upload ảnh lên Cloudinary
        const images = req.files?.image || [];
        const imageUrls = await Promise.all(images.map((img) => uploadImage(img.path)))
        // Upload video lên Cloudinary
        const shop = await shopShema.findOne({ createBy: idUser });
        if (!shop) {
            sendResponse(res, responseCode.forbidden, statusCode.fail, {}, "shop is not exist");
        }
        const videoFile = req.files?.video?.[0];
        let videoUrl = ""
        if (videoFile) {
            videoUrl = await uploadVideo(videoFile.path);
        }

        const data = await productSchema.create({
            name: name, category: category, quantity: quantity, description: description,
            videoUrl: videoUrl, shop_id: shop.shop_id,
            imageUrls: imageUrls, createBy: idUser,
            cost: {
                currency: currency,
                amount: amount,
                discount: discount
            },
            dimension: {
                weight: weight,
                width: width,
                height: height,
                length: length
            },
            size: JSON.parse(size)
        });
        console.log(data)
        sendResponse(res, responseCode.created, statusCode.success, data, responseMessage.created);
    } catch (error) {
        sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message);
        console.log(error)
    }
};
// Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
    try {
        const { searchBy, limit, isCommunal, pageNumber, isApproved, } = req.params;
        const query = {};
        const { role, idUser } = req.user || {};
        if (isCommunal === "false") {
            if (role === 'admin') {
                query.isApproved = isApproved === "true" ? true : false;
            }
            else if (idUser) {
                query.idUser = idUser;
            }
        } else query.isApproved = "true"
        if (searchBy && searchBy !== 'all') {
            query.$or = [
                { name: { $regex: searchBy, $options: 'i' } },
                { category: { $regex: searchBy, $options: 'i' } }
            ];
        }
        const perPage = parseInt(limit) || 10;
        const page = parseInt(pageNumber) || 1;
        const skip = (page - 1) * perPage;
        const products = await productSchema
            .find(query)
            .skip(skip)
            .limit(perPage)
            .sort({ rate: -1, createdAt: -1 });
        const totalProducts = await productSchema.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / perPage);

        const responseData = {
            listProducts: products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                perPage
            }
        };
        sendResponse(res, responseCode.success, statusCode.success, responseData, responseMessage.success);
    } catch (error) {
        sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message);
    }
};

// Lấy thông tin sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const product = await productSchema.findById(req.params.id);
        if (!product) {
            return sendResponse(res, responseCode.notFound, statusCode.fail, {}, responseMessage.notFound);
        }
        sendResponse(res, responseCode.success, statusCode.success, product, responseMessage.success);
    } catch (error) {
        console.log(error)
        sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message);
    }
};

// Cập nhật sản phẩm
// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { name, category, quantity, description } = req.body;

        // Upload ảnh mới lên Cloudinary (nếu có)
        const images = req.files?.image || [];
        const imageUrls = await Promise.all(
            images.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'products',
                    resource_type: 'image'
                });
                fs.unlinkSync(file.path);
                return result.secure_url;
            })
        );

        // Upload video mới lên Cloudinary (nếu có)
        const videoFile = req.files?.video?.[0];
        let videoUrl = '';
        if (videoFile) {
            const videoResult = await cloudinary.uploader.upload(videoFile.path, {
                folder: 'products',
                resource_type: 'video'
            });
            fs.unlinkSync(videoFile.path);
            videoUrl = videoResult.secure_url;
        }

        const updateData = {
            name,
            category,
            quantity,
            description,
        };

        // Nếu có ảnh mới thì cập nhật
        if (imageUrls.length > 0) {
            updateData.imageUrls = imageUrls;
        }

        // Nếu có video mới thì cập nhật
        if (videoUrl) {
            updateData.videoUrl = videoUrl;
        }

        const updatedProduct = await productSchema.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return sendResponse(res, responseCode.notFound, statusCode.fail, {}, responseMessage.notFound);
        }
        sendResponse(res, responseCode.ok, statusCode.success, updatedProduct, responseMessage.updated);
    } catch (error) {
        sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message);
    }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productSchema.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return sendResponse(res, responseCode.notFound, statusCode.fail, {}, responseMessage.notFound);
        }

        sendResponse(res, responseCode.ok, statusCode.success, {}, responseMessage.deleted);
    } catch (error) {
        sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,

};
