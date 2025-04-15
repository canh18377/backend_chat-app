const userRoute = require('./userRoute');
const conversationRoute = require('./conversationRoute');
const messageRoute = require('./messageRoute');
function private_route(app) {
    app.use("/api/user", userRoute);
    app.use("/api/conversations", conversationRoute);
    app.use("/api/message", messageRoute);
}
module.exports = private_route;
