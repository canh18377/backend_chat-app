const commonController = require("../../controllers/commonControllers")
function route(app) {
    app.put('/api/communal/toggle-switch', commonController.toggleApproval)
}
module.exports = route;
