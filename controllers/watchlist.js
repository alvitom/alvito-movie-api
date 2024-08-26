const axios = require("axios");
const Watchlist = require("../models/watchlist");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user");
const httpResponse = require("../utils/httpResponse");
const BASE_URL = process.env.ALVITO_MOVIE_API_BASE_URL;

const store = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { mediaType, mediaId } = req.body;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return httpResponse(res, "Request failed with status code 404", { error: "User Not Found" }, 404);
    }

    const findMovie = await Watchlist.findOne({ userId: id, mediaType, mediaId });

    if (findMovie) {
      return httpResponse(res, "Request failed with status code 409", { error: "Already Added To Watchlist" }, 409);
    }

    const response = await axios.get(`${BASE_URL}/${mediaType}/${mediaId}`);

    const { result } = response.data;

    const watchlist = await Watchlist.create({
      userId: id,
      mediaType,
      mediaId,
      title: mediaType === "movie" ? result.title : result.name,
      description: result.overview,
      releaseDate: mediaType === "movie" ? result.release_date : result.first_air_date,
      posterPath: result.poster_path,
    });

    httpResponse(res, "Watchlist Created Successfully", { result: watchlist }, 201);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.error }, error.response.status);
    }
    next(error);
  }
};

const movies = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { page = 1 } = req.query;
  const limit = 20;

  if (page < 1 || page > 500 || isNaN(parseInt(page))) {
    return httpResponse(res, "Request failed with status code 400", { error: "Invalid page: Pages start at 1 and max at 500. They are expected to be an integer." }, 400);
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    return httpResponse(res, "Request failed with status code 404", { error: "User Not Found" }, 404);
  }

  const watchlist = await Watchlist.find({ userId: id, mediaType: "movie" })
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 });
  const total = await Watchlist.countDocuments({ userId: id, mediaType: "movie" });
  const totalPages = Math.ceil(total / limit);

  const data = {
    results: watchlist,
    total_results: total,
    total_results_current_page: watchlist.length,
    current_page: parseInt(page),
    total_pages: totalPages,
    per_page: limit,
  };

  httpResponse(res, "Watchlist Movies Retrieved Successfully", data, 200);
});

const tv = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { page = 1 } = req.query;
  const limit = 20;

  if (page < 1 || page > 500 || isNaN(parseInt(page))) {
    return httpResponse(res, "Request failed with status code 400", { error: "Invalid page: Pages start at 1 and max at 500. They are expected to be an integer." }, 400);
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    return httpResponse(res, "Request failed with status code 404", { error: "User Not Found" }, 404);
  }

  const watchlist = await Watchlist.find({ userId: id, mediaType: "tv" })
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 });
  const total = await Watchlist.countDocuments({ userId: id, mediaType: "tv" });
  const totalPages = Math.ceil(total / limit);

  const data = {
    results: watchlist,
    total_results: total,
    total_results_current_page: watchlist.length,
    current_page: parseInt(page),
    total_pages: totalPages,
    per_page: limit,
  };

  httpResponse(res, "Watchlist TV Series Retrieved Successfully", data, 200);
});

module.exports = { store, movies, tv };
