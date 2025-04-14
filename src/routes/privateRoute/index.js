const userRoute = require('./userRoute');
const conversationRoute = require('./conversationRoute');
function private_route(app) {
    app.use("/api/user", userRoute);
    app.use("/api/conversations", conversationRoute);
}
module.exports = private_route;
