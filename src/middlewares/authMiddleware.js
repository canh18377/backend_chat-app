const {
  responseCode,
  statusCode,
  responseMessage,
  sendResponse
} = require('../utils/responseCode');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const secretAccessToken = process.env.ACCESS_TOKEN_SECRET
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token && req.originalUrl.includes("communal")) {
    return next();
  }
  if (token) {
    const accessToken = token.split(" ")[1]
    try {
      const decoded = jwt.verify(accessToken, secretAccessToken);
      req.user = decoded;
      return next();
    } catch (error) {
      return sendResponse(res, responseCode.unauthorized, statusCode.fail, {}, "Invalid token");
    }
  }
  return sendResponse(res, responseCode.unauthorized, statusCode.fail, {}, "Unauthorized");
};

module.exports = authenticate