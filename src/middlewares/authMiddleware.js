require('dotenv').config()
const jwt = require('jsonwebtoken')
const secretAccessToken = process.env.ACCESS_TOKEN_SECRET
const authenticate = (req, res, next) => {
  console.log(req.originalUrl)
  const token = req.headers['authorization']
  console.log(token)

  if (token) {
    const accessToken = token.split(" ")[1]
    try {
      const decoded = jwt.verify(accessToken, secretAccessToken);
      req.user = decoded;
      return next();
    } catch (error) {
      console.log(error)
      res.status(404).json("Failed Auth")
    }
  } else {
    res.status(404).json("unAuth")
  }
};

module.exports = authenticate