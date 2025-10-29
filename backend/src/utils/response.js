function sendResponse(res, statusCode, data, message) {
  res.status(statusCode).json({
    status: "success",
    data: data,
    message: message,
  });
}

// Nueva función response más completa
function response(res, options) {
  const {
    status = 200,
    success = true,
    message = "",
    data = null,
    errors = null,
    pagination = null
  } = options;

  const responseObj = {
    success,
    message,
    data
  };

  if (errors) {
    responseObj.errors = errors;
  }

  if (pagination) {
    responseObj.pagination = pagination;
  }

  res.status(status).json(responseObj);
}

export default sendResponse;
export { response };
  