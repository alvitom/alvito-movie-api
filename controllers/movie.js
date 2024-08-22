const slugify = require("slugify");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/response");
const axiosInstance = require("../utils/axiosInstance");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const getMovieBySearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  try {
    const movies = await axiosInstance.get("/search/movie", {
      params: {
        query: q,
        page: req.query.page || 1,
      },
    });

    if (movies.data.results.length === 0) {
      return ApiResponse.error(res, "Movie Not Found", "Movie Not Found", 404);
    }

    movies.data.results = movies.data.results.map((movie) => ({
      ...movie,
      backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      poster_path: IMG_BASE_URL + movie.poster_path,
      release_date: new Date(movie.release_date).toDateString(),
      popularity: Math.round(movie.popularity * 10) / 10,
      vote_average: Math.round(movie.vote_average * 10) / 10,
      slug: slugify(movie.title, { lower: true }),
    }));

    movies.data.total_pages = movies.data.total_pages > 500 ? 500 : movies.data.total_pages;

    const paginationInfo = {
      first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=1`,
      last_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=${movies.data.total_pages}`,
      prev_page_url: req.query.page > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=${parseInt(req.query.page) - 1}` : null,
      next_page_url: !req.query.page
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=2`
        : req.query.page < movies.data.total_pages
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=${parseInt(req.query.page) + 1}`
        : null,
      current_page: movies.data.page,
      last_page: movies.data.total_pages,
      from: movies.data.results[0].id,
      to: movies.data.results[movies.data.results.length - 1].id,
      total: movies.data.total_results,
      path: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}`,
      per_page: movies.data.results.length,
    };

    ApiResponse.pagination(res, movies.data.results, paginationInfo, "Movie By Search Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Movie By Search Not Found", status_message, 404);
  }
});

const getMovieByGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const movies = await axiosInstance.get("/discover/movie", {
      params: {
        with_genres: id,
        page: req.query.page || 1,
      },
    });

    if (movies.data.results.length === 0) {
      return ApiResponse.error(res, "Movie Not Found", "Movie Not Found", 404);
    }

    movies.data.results = movies.data.results.map((movie) => ({
      ...movie,
      backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      poster_path: IMG_BASE_URL + movie.poster_path,
      release_date: new Date(movie.release_date).toDateString(),
      popularity: Math.round(movie.popularity * 10) / 10,
      vote_average: Math.round(movie.vote_average * 10) / 10,
      slug: slugify(movie.title, { lower: true }),
    }));

    movies.data.total_pages = movies.data.total_pages > 500 ? 500 : movies.data.total_pages;

    const paginationInfo = {
      first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=1`,
      last_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${movies.data.total_pages}`,
      prev_page_url: req.query.page > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) - 1}` : null,
      next_page_url: !req.query.page
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=2`
        : req.query.page < movies.data.total_pages
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) + 1}`
        : null,
      current_page: movies.data.page,
      last_page: movies.data.total_pages,
      from: movies.data.results[0].id,
      to: movies.data.results[movies.data.results.length - 1].id,
      total: movies.data.total_results,
      path: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}`,
      per_page: movies.data.results.length,
    };

    ApiResponse.pagination(res, movies.data.results, paginationInfo, "Movie By Genre Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Movie By Genre Not Found", status_message, 404);
  }
});

const getMovieNowPlayingList = asyncHandler(async (req, res) => {
  try {
    const movies = await axiosInstance.get("/movie/now_playing", {
      params: {
        page: req.query.page || 1,
      },
    });

    if (movies.data.results.length === 0) {
      return ApiResponse.error(res, "Movie Not Found", "Movie Not Found", 404);
    }

    movies.data.results = movies.data.results.map((movie) => ({
      ...movie,
      backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      poster_path: IMG_BASE_URL + movie.poster_path,
      release_date: new Date(movie.release_date).toDateString(),
      popularity: Math.round(movie.popularity * 10) / 10,
      vote_average: Math.round(movie.vote_average * 10) / 10,
      slug: slugify(movie.title, { lower: true }),
    }));

    movies.data.total_pages = movies.data.total_pages > 500 ? 500 : movies.data.total_pages;

    if (req.query.limit) {
      movies.data.results = movies.data.results.slice(0, parseInt(req.query.limit));
    }

    const paginationInfo = {
      first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=1`,
      last_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${movies.data.total_pages}`,
      prev_page_url: req.query.page > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) - 1}` : null,
      next_page_url: !req.query.page
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=2`
        : req.query.page < movies.data.total_pages
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) + 1}`
        : null,
      current_page: movies.data.page,
      last_page: movies.data.total_pages,
      from: movies.data.results[0].id,
      to: movies.data.results[movies.data.results.length - 1].id,
      total: movies.data.total_results,
      path: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}`,
      per_page: movies.data.results.length,
    };

    ApiResponse.pagination(res, movies.data.results, paginationInfo, "Movie Now Playing Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Movie Now Playing Not Found", status_message, 404);
  }
});

const getMoviePopularList = asyncHandler(async (req, res) => {
  try {
    const movies = await axiosInstance.get("/movie/popular", {
      params: {
        page: req.query.page || 1,
      },
    });

    if (movies.data.results.length === 0) {
      return ApiResponse.error(res, "Movie Not Found", "Movie Not Found", 404);
    }

    movies.data.results = movies.data.results.map((movie) => ({
      ...movie,
      backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      poster_path: IMG_BASE_URL + movie.poster_path,
      release_date: new Date(movie.release_date).toDateString(),
      popularity: Math.round(movie.popularity * 10) / 10,
      vote_average: Math.round(movie.vote_average * 10) / 10,
      slug: slugify(movie.title, { lower: true }),
    }));

    movies.data.total_pages = movies.data.total_pages > 500 ? 500 : movies.data.total_pages;

    if (req.query.limit) {
      movies.data.results = movies.data.results.slice(0, parseInt(req.query.limit));
    }

    const paginationInfo = {
      first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=1`,
      last_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${movies.data.total_pages}`,
      prev_page_url: req.query.page > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) - 1}` : null,
      next_page_url: !req.query.page
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=2`
        : req.query.page < movies.data.total_pages
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) + 1}`
        : null,
      current_page: movies.data.page,
      last_page: movies.data.total_pages,
      from: movies.data.results[0].id,
      to: movies.data.results[movies.data.results.length - 1].id,
      total: movies.data.results.length * movies.data.total_pages,
      path: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}`,
      per_page: movies.data.results.length,
    };

    ApiResponse.pagination(res, movies.data.results, paginationInfo, "Movie Popular Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Movie Popular List Not Found", status_message, 404);
  }
});

const getMovieTopRatedList = asyncHandler(async (req, res) => {
  try {
    const movies = await axiosInstance.get("/movie/top_rated", {
      params: {
        page: req.query.page || 1,
      },
    });

    if (movies.data.results.length === 0) {
      return ApiResponse.error(res, "Movie Not Found", "Movie Not Found", 404);
    }

    movies.data.results = movies.data.results.map((movie) => ({
      ...movie,
      backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      poster_path: IMG_BASE_URL + movie.poster_path,
      release_date: new Date(movie.release_date).toDateString(),
      popularity: Math.round(movie.popularity * 10) / 10,
      vote_average: Math.round(movie.vote_average * 10) / 10,
      slug: slugify(movie.title, { lower: true }),
    }));

    movies.data.total_pages = movies.data.total_pages > 500 ? 500 : movies.data.total_pages;

    if (req.query.limit) {
      movies.data.results = movies.data.results.slice(0, parseInt(req.query.limit));
    }

    const paginationInfo = {
      first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=1`,
      last_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${movies.data.total_pages}`,
      prev_page_url: req.query.page > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) - 1}` : null,
      next_page_url: !req.query.page
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=2`
        : req.query.page < movies.data.total_pages
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) + 1}`
        : null,
      current_page: movies.data.page,
      last_page: movies.data.total_pages,
      from: movies.data.results[0].id,
      to: movies.data.results[movies.data.results.length - 1].id,
      total: movies.data.total_results,
      path: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}`,
      per_page: movies.data.results.length,
    };

    ApiResponse.pagination(res, movies.data.results, paginationInfo, "Movie Top Rated Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Movie Top Rated List Not Found", status_message, 404);
  }
});

const getMovieUpcomingList = asyncHandler(async (req, res) => {
  try {
    const movies = await axiosInstance.get("/movie/upcoming", {
      params: {
        page: req.query.page || 1,
      },
    });

    if (movies.data.results.length === 0) {
      return ApiResponse.error(res, "Movie Not Found", "Movie Not Found", 404);
    }

    movies.data.results = movies.data.results.map((movie) => ({
      ...movie,
      backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      poster_path: IMG_BASE_URL + movie.poster_path,
      release_date: new Date(movie.release_date).toDateString(),
      popularity: Math.round(movie.popularity * 10) / 10,
      vote_average: Math.round(movie.vote_average * 10) / 10,
      slug: slugify(movie.title, { lower: true }),
    }));

    movies.data.total_pages = movies.data.total_pages > 500 ? 500 : movies.data.total_pages;

    if (req.query.limit) {
      movies.data.results = movies.data.results.slice(0, parseInt(req.query.limit));
    }

    const paginationInfo = {
      first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=1`,
      last_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${movies.data.total_pages}`,
      prev_page_url: req.query.page > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) - 1}` : null,
      next_page_url: !req.query.page
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=2`
        : req.query.page < movies.data.total_pages
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}?page=${parseInt(req.query.page) + 1}`
        : null,
      current_page: movies.data.page,
      last_page: movies.data.total_pages,
      from: movies.data.results[0].id,
      to: movies.data.results[movies.data.results.length - 1].id,
      total: movies.data.total_results,
      path: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(`?page=${req.query.page}`, "")}`,
      per_page: movies.data.results.length,
    };

    ApiResponse.pagination(res, movies.data.results, paginationInfo, "Movie Upcoming Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Movie Upcoming List Not Found", status_message, 404);
  }
});

const getMovieDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await axiosInstance.get(`/movie/${id}`);

    if (!movie.data) {
      return ApiResponse.error(res, "Movie Not Found", "Movie Not Found", 404);
    }

    const credits = await axiosInstance.get(`/movie/${id}/credits`);

    if (!credits.data) {
      credits.data = null;
    }

    const videos = await axiosInstance.get(`/movie/${id}/videos`);

    if (!videos.data) {
      videos.data = null;
    }

    const images = await axiosInstance.get(`/movie/${id}/images`);

    if (!images.data) {
      images.data = null;
    }

    if (credits.data.cast.length === 0) {
      credits.data.cast = null;
    }

    if (credits.data.crew.length === 0) {
      credits.data.crew = null;
    }

    if (images.data.posters.length === 0) {
      images.data.posters = null;
    }

    if (images.data.backdrops.length === 0) {
      images.data.backdrops = null;
    }

    if (images.data.logos.length === 0) {
      images.data.logos = null;
    }

    if (videos.data.results.length === 0) {
      videos.data.results = null;
    }

    // backdrop_path
    movie.data.backdrop_path = IMG_BASE_URL + movie.data.backdrop_path;

    // belongs_to_collection
    if (movie.data.belongs_to_collection) {
      movie.data.belongs_to_collection.poster_path = IMG_BASE_URL + movie.data.belongs_to_collection.poster_path;
      movie.data.belongs_to_collection.backdrop_path = IMG_BASE_URL + movie.data.belongs_to_collection.backdrop_path;
    }

    // poster_path
    movie.data.poster_path = IMG_BASE_URL + movie.data.poster_path;

    // production_companies
    movie.data.production_companies = movie.data.production_companies?.map((company) => ({
      ...company,
      logo_path: IMG_BASE_URL + company.logo_path,
    }));

    // release_date
    movie.data.release_date = new Date(movie.data.release_date).toDateString();

    // popularity
    movie.data.popularity = Math.round(movie.data.popularity * 10) / 10;

    // vote_average
    movie.data.vote_average = Math.round(movie.data.vote_average * 10) / 10;

    // slug
    movie.data.slug = slugify(movie.data.title, { lower: true });

    // credits
    credits.data.cast = credits.data.cast?.map((cast) => ({
      ...cast,
      profile_path: IMG_BASE_URL + cast.profile_path,
    }));
    credits.data.crew = credits.data.crew?.map((crew) => ({
      ...crew,
      profile_path: IMG_BASE_URL + crew.profile_path,
    }));

    // images
    images.data.backdrops = images.data.backdrops?.map((image) => ({
      ...image,
      file_path: IMG_BASE_URL + image.file_path,
    }));
    images.data.logos = images.data.logos?.map((image) => ({
      ...image,
      file_path: IMG_BASE_URL + image.file_path,
    }));
    images.data.posters = images.data.posters?.map((image) => ({
      ...image,
      file_path: IMG_BASE_URL + image.file_path,
    }));

    ApiResponse.show(res, { ...movie.data }, { credits: credits.data, videos: videos.data, images: images.data }, "Movie Detail Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Movie Detail Not Found", status_message, 404);
  }
});

module.exports = {
  getMovieBySearch,
  getMovieByGenre,
  getMovieNowPlayingList,
  getMoviePopularList,
  getMovieTopRatedList,
  getMovieUpcomingList,
  getMovieDetail,
};
