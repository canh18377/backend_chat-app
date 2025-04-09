const OAuthRouter = require('./open-authRouter');
const authController = require('../../controllers/authController')
const roleController = require('../../controllers/roleController')
function authRoute(app) {
    app.use("/api/refresh-token", authController.refreshToken);
    app.use("/api/auth", OAuthRouter);
    app.get('/api/role', roleController.index)
}
module.exports = authRoute;
