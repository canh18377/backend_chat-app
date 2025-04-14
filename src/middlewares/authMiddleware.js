require('dotenv').config()
const jwt = require('jsonwebtoken')
const secretAccessToken = process.env.ACCESS_TOKEN_SECRET
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']
  if (token) {
    const accessToken = token.split(" ")[1]
    try {
      const decoded = jwt.verify(accessToken, secretAccessToken);
      req.user = decoded;
      return next();
    } catch (error) {
      res.status(404).json("not found")
    }
  }
};

module.exports = authenticate