const userRoute = require('./userRoute');
function private_route(app) {
    app.use("/api/user", userRoute);
}
module.exports = private_route;
