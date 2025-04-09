const responseCode = {
  success: 200,            // HTTP Status 200 - OK
  created: 201,
  deleted: 210,
  updated: 211,
  existed: 215,
  no_content: 204,            // HTTP Status 201 - Created
  badRequest: 400,         // HTTP Status 400 - Bad Request
  unauthorized: 401,       // HTTP Status 401 - Unauthorized
  forbidden: 403,          // HTTP Status 403 - Forbidden
  notFound: 404,           // HTTP Status 404 - Not Found
  serverError: 500         // HTTP Status 500 - Internal Server Error
};

const statusCode = {
  success: 0,              // Thành công
  fail: 1                  // Thất bại
};

const responseMessage = {
  success: "Thành công",
  created: "Tạo mới thành công",
  badRequest: "Yêu cầu không hợp lệ",
  unauthorized: "Không có quyền truy cập",
  forbidden: "Bị cấm",
  notFound: "Không tìm thấy",
  serverError: "Lỗi máy chủ"
};
;

const sendResponse = (res, responseCode, statusCode, result = {}, message = "") => {
  res.status(responseCode).json({
    statusCode,
    responseCode,
    message,
    result
  });
};

module.exports = {
  responseCode,
  responseMessage,
  statusCode,
  sendResponse
};
