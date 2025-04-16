const userRoute = require('./userRoute');
const conversationRoute = require('./conversationRoute');
const messageRoute = require('./messageRoute');
const callRoute = require('./callRoute');
function private_route(app) {
    app.use("/api/user", userRoute);
    app.use("/api/conversations", conversationRoute);
    app.use("/api/message", messageRoute);
    app.use("/api/call", callRoute);
}
module.exports = private_route;
