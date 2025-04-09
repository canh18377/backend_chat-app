const cloudinary = require('../config/cloudinary');
const fs = require('fs')
// Upload ảnh lên Cloudinary
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'images',          // Thư mục lưu trữ trên Cloudinary
            resource_type: 'image'       // Loại file: image
        });
        fs.unlinkSync(filePath);  // Xóa file tạm sau khi upload
        return result.secure_url;
    } catch (error) {
        throw error;
    }
};
// Upload video lên Cloudinary
const uploadVideo = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'videos',          // Thư mục lưu trữ trên Cloudinary
            resource_type: 'video'       // Loại file: video
        });
        fs.unlinkSync(filePath)
        return result.secure_url;
    } catch (error) {
        throw error;
    }
};
module.exports = { uploadImage, uploadVideo }