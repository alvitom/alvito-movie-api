const ApiResponse = require("../utils/response");

const notFound = (req, res) => {
  ApiResponse.error(
    res,
    "Not Found",
    {
      url: req.originalUrl,
    },
    404
  );
};

const errorHandler = (err, req, res, next) => {
  ApiResponse.error(res, err.message || "Something went wrong", {}, err.statusCode || 500);
};

module.exports = { notFound, errorHandler };
