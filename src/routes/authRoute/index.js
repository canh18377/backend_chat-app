const OAuthRouter = require('./open-auth');
function authRoute(app) {
    app.use("/api/auth", (res, req, next) => { console.log("next"), next() }, OAuthRouter);
}
module.exports = authRoute;
