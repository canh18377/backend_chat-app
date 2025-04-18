const userRoute = require('./userRoute');
const conversationRoute = require('./conversationRoute');
const messageRoute = require('./messageRoute');
const callRoute = require('./callRoute');
const friendRoute = require('./friendRoute');
function private_route(app) {
    app.use("/api/user", userRoute);
    app.use("/api/conversations", conversationRoute);
    app.use("/api/message", messageRoute);
    app.use("/api/call", callRoute);
    app.use("/api/friend", friendRoute);
}
module.exports = private_route;
