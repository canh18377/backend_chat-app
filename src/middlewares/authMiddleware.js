require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretAccessToken = process.env.ACCESS_TOKEN_SECRET;

// Import blacklist từ logout route
let tokenBlacklist;
try {
  tokenBlacklist = require('../routes/authRoute/logout').tokenBlacklist;
} catch (error) {
  tokenBlacklist = new Set(); // Fallback nếu chưa có logout route
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing or invalid format' });
  }

  const rawToken = authHeader.split(' ')[1];
  const accessToken = rawToken.split('#')[0];

  // Kiểm tra token có trong blacklist không
  if (tokenBlacklist && tokenBlacklist.has(accessToken)) {
    return res.status(401).json({ message: 'Unauthorized: Token has been revoked' });
  }

  try {
    const decoded = jwt.verify(accessToken, secretAccessToken);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = authenticate;