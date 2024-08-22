const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/response");
const axiosInstance = require("../utils/axiosInstance");

const getGenreMovieList = asyncHandler(async (_, res) => {
  const genres = await axiosInstance.get("/genre/movie/list");

  const paginationInfo = {
    total: genres.data.genres.length,
  };

  ApiResponse.pagination(res, genres.data.genres, paginationInfo, "Genres Retrieved Successfully");
});

module.exports = { getGenreMovieList };
