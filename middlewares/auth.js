const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/response");

const auth = (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        let errors = {};
        if (err.name === "TokenExpiredError") {
          errors.authorization = errors.authorization || [];
          errors.authorization.push("Token expired");
        } else if (err.name === "JsonWebTokenError") {
          errors.authorization = errors.authorization || [];
          errors.authorization.push("Invalid token");
        }
        return ApiResponse.error(res, "Unauthorized", errors, 401);
      }

      req.user = user;
      next();
    });
  } else {
    let errors = {};

    if (!req.headers.authorization) {
      errors.authorization = errors.authorization || [];
      errors.authorization.push("No token provided");
    }

    if (!req.headers.authorization?.startsWith("Bearer")) {
      errors.authorization = errors.authorization || [];
      errors.authorization.push("Token must be started with Bearer");
    }

    if (Object.keys(errors).length > 0) {
      return ApiResponse.error(res, "Validation Error", errors, 400);
    }
  }
};

const isAuthenticated = (req, _, next) => {
  const { ALVITO_MOVIE_TOKEN } = req.cookies;

  if (ALVITO_MOVIE_TOKEN) {
    const user = jwt.verify(ALVITO_MOVIE_TOKEN, process.env.JWT_SECRET);
    req.user = user;
  }

  next();
};

const admin = (req, _, next) => {
  if (req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    throw new ErrorResponse(403, "Forbidden");
  }
};
module.exports = { auth, isAuthenticated, admin };
