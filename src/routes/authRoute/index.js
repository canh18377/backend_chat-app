const OAuthRouter = require('./open-auth');
const { router: logoutRouter } = require('./logout');
function authRoute(app) {
    app.use("/api/auth", OAuthRouter);
    app.use("/api/auth", logoutRouter);

}
module.exports = authRoute;
