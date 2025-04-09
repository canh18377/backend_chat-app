const { statusCode, responseCode, message, sendResponse } = require('../utils/responseCode')
class profileController {
    index(req, res) {
        return sendResponse(res, responseCode.success, statusCode.success, {}, "")
    }
}
module.exports = new profileController();
