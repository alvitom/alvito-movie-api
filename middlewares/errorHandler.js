const httpResponse = require("../utils/httpResponse");

const notFound = (req, res) => {
  httpResponse(
    res,
    "Request failed with status code 404",
    {
      errors: {
        information: "URL Not Found",
        url: req.originalUrl,
      },
    },
    404
  );
};

const errorHandler = (err, req, res, next) => {
  httpResponse(res, "Request failed with status code 500", { errors: err.message }, 500);
};

module.exports = { notFound, errorHandler };
