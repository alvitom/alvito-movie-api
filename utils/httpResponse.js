const httpResponse = (res, message, payload, statusCode) => {
  res.status(statusCode).json({
    message,
    ...payload,
  });
};

module.exports = httpResponse;
