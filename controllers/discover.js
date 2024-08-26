const slugify = require("slugify");
const axiosInstance = require("../utils/axiosInstance");
const httpResponse = require("../utils/httpResponse");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const movie = async (req, res, next) => {
  try {
    const movies = await axiosInstance.get("/discover/movie", {
      params: {
        ...req.query,
        page: req.query.page || 1,
      },
    });

    if (movies.data.results.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "Movie Not Found" }, 404);
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

    movies.data.total_results = movies.data.total_pages >= 500 ? movies.data.total_pages * movies.data.results.length : movies.data.total_results;

    const moreInfo = {
      total_results: movies.data.total_results,
      total_results_current_page: movies.data.results.length,
      current_page: movies.data.page,
      total_pages: movies.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: movies.data.results,
      ...moreInfo,
    };

    httpResponse(res, "Discover Movie List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const tv = async (req, res, next) => {
  try {
    const tvs = await axiosInstance.get("/discover/tv", {
      params: {
        ...req.query,
        page: req.query.page || 1,
      },
    });

    if (tvs.data.results.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "TV Not Found" }, 404);
    }

    tvs.data.results = tvs.data.results.map((tv) => ({
      ...tv,
      backdrop_path: IMG_BASE_URL + tv.backdrop_path,
      poster_path: IMG_BASE_URL + tv.poster_path,
      first_air_date: new Date(tv.first_air_date).toDateString(),
      popularity: Math.round(tv.popularity * 10) / 10,
      vote_average: Math.round(tv.vote_average * 10) / 10,
      slug: slugify(tv.name, { lower: true }),
    }));

    tvs.data.total_pages = tvs.data.total_pages > 500 ? 500 : tvs.data.total_pages;

    tvs.data.total_results = tvs.data.total_pages >= 500 ? tvs.data.total_pages * tvs.data.results.length : tvs.data.total_results;

    const moreInfo = {
      total_results: tvs.data.total_results,
      total_results_current_page: tvs.data.results.length,
      current_page: tvs.data.page,
      total_pages: tvs.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: tvs.data.results,
      ...moreInfo,
    };

    httpResponse(res, "Discover TV List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

module.exports = { movie, tv };
