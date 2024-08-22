const asyncHandler = (asyncFn) => {
  return (req, res, next) => {
    asyncFn(req, res, next).catch((error) => next(error));
  };
};

module.exports = asyncHandler