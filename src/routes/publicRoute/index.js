const dashboardRoute = require('./dashboardRoute')
function route(app) {
    app.get('/api/', dashboardRoute)
}
module.exports = route;
