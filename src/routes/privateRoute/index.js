const productRouter = require('./productRoute')
const userRouter = require('./userRoute')
const cartRouter = require('./cartRoute')
const ghnRouter = require('./ghnRoute')
const shopRouter = require('./shopRoute')
function route(app) {
    app.use('/api/products', productRouter)
    app.use('/api/users', userRouter)
    app.use('/api/cart', cartRouter)
    app.use('/api/ghn', ghnRouter)
    app.use('/api/shop', shopRouter)
}
module.exports = route;
