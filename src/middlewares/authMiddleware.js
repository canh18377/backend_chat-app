require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretAccessToken = process.env.ACCESS_TOKEN_SECRET;

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Kiểm tra có Authorization header và định dạng đúng
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing or invalid format' });
  }

  // Lấy token và loại bỏ phần sau dấu #
  const rawToken = authHeader.split(' ')[1];
  const accessToken = rawToken.split('#')[0]; // Loại bỏ fragment nếu có

  try {
    // Xác thực token
    const decoded = jwt.verify(accessToken, secretAccessToken);

    // Lưu thông tin user vào request
    req.user = decoded;

    // Cho đi tiếp
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = authenticate;
