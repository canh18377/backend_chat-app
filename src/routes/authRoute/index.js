const OAuthRouter = require('./open-auth');
function authRoute(app) {
    app.use("/api/auth", OAuthRouter);

}
module.exports = authRoute;
