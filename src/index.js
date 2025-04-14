const express = require('express');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport');
const config_websoket = require('./config/websocket')
const cookieParser = require('cookie-parser');
const verifyAccessToken = require('./middlewares/authMiddleware')
const connectDB = require('./middlewares/connectDb')
const authRoute = require('./routes/authRoute')
const private_route = require("./routes/privateRoute")
const cors = require('cors')
const http = require('http');
connectDB()
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
config_websoket(server)
app.use('/uploads', express.static(path.join(__dirname, "src", 'uploads')));
app.use(passport.initialize());
authRoute(app);
app.use(verifyAccessToken)
private_route(app)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
