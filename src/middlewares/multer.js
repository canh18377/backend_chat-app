const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục 'src/uploads/' nếu chưa tồn tại
const uploadDir = 'src/uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file tạm trên server trước khi upload lên Cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Lưu trong thư mục 'src/uploads/'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Tên file: timestamp + đuôi file
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Chấp nhận các định dạng hình ảnh và video
        const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webp|flv|wmv/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('File không hợp lệ. Chỉ chấp nhận ảnh và video.'));
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024  // Giới hạn kích thước file: 50MB
    }
});

module.exports = upload;
