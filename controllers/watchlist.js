const axios = require("axios");
const Watchlist = require("../models/watchlist");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user");
const ApiResponse = require("../utils/response");
const BASE_URL = process.env.ALVITO_MOVIE_API_BASE_URL;

const createWatchlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { movieId } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return ApiResponse.error(res, "Not Found", { user: "User Not Found" }, 404);
  }

  const findMovie = await Watchlist.findOne({ movieId });

  if (findMovie) {
    return ApiResponse.error(res, "Forbidden", { watchlist: "Movie Already Exists in Watchlist" }, 403);
  }

  const response = await axios.get(`${BASE_URL}/movie/${movieId}`);
  const datas = await response.data;
  const { data } = await datas;
  const movie = {
    movieId: data.id,
    title: data.title,
    description: data.overview,
    releaseDate: data.release_date,
    posterPath: data.poster_path,
  };

  const watchlist = await Watchlist.create({ userId: id, ...movie });

  ApiResponse.success(res, watchlist, "Watchlist Created Successfully", 201);
});

const getWatchlist = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return ApiResponse.error(res, "Not Found", { user: "User Not Found" }, 404);
  }

  const watchlist = await Watchlist.find({ userId: id });

  const paginationInfo = {
    total: watchlist.length,
  };

  ApiResponse.pagination(res, watchlist, paginationInfo, "Watchlist Retrieved Successfully");
});

module.exports = { createWatchlist, getWatchlist };
