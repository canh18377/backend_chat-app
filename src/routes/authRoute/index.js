const OAuthRouter = require('./open-auth');
const logoutRouter = require('./logout');
function authRoute(app) {
    app.use("/api/auth", OAuthRouter);
    app.use("/api/auth", logoutRouter); // Thêm logout route

}
module.exports = authRoute;
