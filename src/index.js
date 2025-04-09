const express = require('express');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport');
const cookieParser = require('cookie-parser');
const verifyAccessToken = require('./middlewares/authMiddleware')
const connectDB = require('./middlewares/connectDb')
const authRoute = require('./routes/authRouter')
const publicRoute = require('./routes/publicRoute')
const privateRoute = require('./routes/privateRoute/index')
const communalRoute = require('./routes/communalRouter')
const cors = require('cors')
connectDB()
const app = express();
const corsOptions = {
    origin: process.env.URL_REDIRECT,  // Phải KHỚP với URL frontend (không có dấu '/' ở cuối)
    credentials: true,                // Cho phép gửi cookie/token
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    exposedHeaders: ['Set-Cookie'],    // Cho phép đọc cookie từ phản hồi
    preflightContinue: false,          // Đảm bảo xử lý đúng preflight request
    optionsSuccessStatus: 204          // Đảm bảo trả về đúng status cho preflight request
};
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, "src", 'uploads')));
app.use(passport.initialize());
app.use("/api", (req, res) => {
    console.log("run")
    res.json("kkkkkkkkk")
})
authRoute(app);
publicRoute(app);
app.use(verifyAccessToken)
communalRoute(app)
privateRoute(app)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
