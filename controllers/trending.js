const slugify = require("slugify");
const axiosInstance = require("../utils/axiosInstance");
const httpResponse = require("../utils/httpResponse");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const movie = async (req, res, next) => {
  try {
    const { timeWindow } = req.params;

    const trending = await axiosInstance.get(`/trending/movie/${timeWindow}`, {
      params: {
        page: req.query.page || 1,
      },
    });

    if (trending.data.results.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "Movie Not Found" }, 404);
    }

    trending.data.results = trending.data.results.map((movie) => ({
      ...movie,
      backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      poster_path: IMG_BASE_URL + movie.poster_path,
      release_date: new Date(movie.release_date).toDateString(),
      popularity: Math.round(movie.popularity * 10) / 10,
      vote_average: Math.round(movie.vote_average * 10) / 10,
      slug: slugify(movie.title, { lower: true }),
    }));

    trending.data.total_pages = trending.data.total_pages > 500 ? 500 : trending.data.total_pages;

    trending.data.total_results = trending.data.total_pages >= 500 ? trending.data.total_pages * trending.data.results.length : trending.data.total_results;

    const moreInfo = {
      total_results: trending.data.total_results,
      total_results_current_page: trending.data.results.length,
      current_page: trending.data.page,
      total_pages: trending.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: trending.data.results,
      ...moreInfo,
    };

    httpResponse(res, "Trending Movie List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const tv = async (req, res, next) => {
  try {
    const { timeWindow } = req.params;

    const trending = await axiosInstance.get(`/trending/tv/${timeWindow}`, {
      params: {
        page: req.query.page || 1,
      },
    });

    if (trending.data.results.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "TV Series Not Found" }, 404);
    }

    trending.data.results = trending.data.results.map((tv) => ({
      ...tv,
      backdrop_path: IMG_BASE_URL + tv.backdrop_path,
      poster_path: IMG_BASE_URL + tv.poster_path,
      first_air_date: new Date(tv.first_air_date).toDateString(),
      popularity: Math.round(tv.popularity * 10) / 10,
      vote_average: Math.round(tv.vote_average * 10) / 10,
      slug: slugify(tv.name, { lower: true }),
    }));

    trending.data.total_pages = trending.data.total_pages > 500 ? 500 : trending.data.total_pages;

    trending.data.total_results = trending.data.total_pages >= 500 ? trending.data.total_pages * trending.data.results.length : trending.data.total_results;

    const moreInfo = {
      total_results: trending.data.total_results,
      total_results_current_page: trending.data.results.length,
      current_page: trending.data.page,
      total_pages: trending.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: trending.data.results,
      ...moreInfo,
    };

    httpResponse(res, "Trending TV Series List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const person = async (req, res, next) => {
  try {
    const { timeWindow } = req.params;

    const trending = await axiosInstance.get(`/trending/person/${timeWindow}`, {
      params: {
        page: req.query.page || 1,
      },
    });

    if (trending.data.results.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "Person Not Found" }, 404);
    }

    trending.data.results = trending.data.results.map((person) => ({
      ...person,
      slug: slugify(person.name, { lower: true }),
      profile_path: IMG_BASE_URL + person.profile_path,
      popularity: Math.round(person.popularity * 10) / 10,
      known_for: person.known_for.map((item) => ({
        ...item,
        vote_average: Math.round(item.vote_average * 10) / 10,
        popularity: Math.round(item.popularity * 10) / 10,
        slug: item.media_type === "tv" ? slugify(item.name, { lower: true }) : slugify(item.title, { lower: true }),
        poster_path: IMG_BASE_URL + item.poster_path,
        backdrop_path: IMG_BASE_URL + item.backdrop_path,
      })),
    }));

    trending.data.total_pages = trending.data.total_pages > 500 ? 500 : trending.data.total_pages;

    trending.data.total_results = trending.data.total_pages >= 500 ? trending.data.total_pages * trending.data.results.length : trending.data.total_results;

    const moreInfo = {
      total_results: trending.data.total_results,
      total_results_current_page: trending.data.results.length,
      current_page: trending.data.page,
      total_pages: trending.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: trending.data.results,
      ...moreInfo,
    };

    httpResponse(res, "Trending Person List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

module.exports = { movie, tv, person };
