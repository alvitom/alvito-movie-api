const slugify = require("slugify");
const axiosInstance = require("../utils/axiosInstance");
const httpResponse = require("../utils/httpResponse");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const movie = async (req, res, next) => {
  try {
    const { q } = req.query;

    const movies = await axiosInstance.get("/search/movie", {
      params: {
        query: q,
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

    httpResponse(res, "Movie By Search Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const tv = async (req, res, next) => {
  try {
    const { q } = req.query;

    const tvSeries = await axiosInstance.get("/search/tv", {
      params: {
        query: q,
        page: req.query.page || 1,
      },
    });

    if (tvSeries.data.results.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "TV Series Not Found" }, 404);
    }

    tvSeries.data.results = tvSeries.data.results.map((tv) => ({
      ...tv,
      backdrop_path: IMG_BASE_URL + tv.backdrop_path,
      poster_path: IMG_BASE_URL + tv.poster_path,
      first_air_date: new Date(tv.first_air_date).toDateString(),
      popularity: Math.round(tv.popularity * 10) / 10,
      vote_average: Math.round(tv.vote_average * 10) / 10,
      slug: slugify(tv.name, { lower: true }),
    }));

    tvSeries.data.total_pages = tvSeries.data.total_pages > 500 ? 500 : tvSeries.data.total_pages;

    tvSeries.data.total_results = tvSeries.data.total_pages >= 500 ? tvSeries.data.total_pages * tvSeries.data.results.length : tvSeries.data.total_results;

    const moreInfo = {
      total_results: tvSeries.data.total_results,
      total_results_current_page: tvSeries.data.results.length,
      current_page: tvSeries.data.page,
      total_pages: tvSeries.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: tvSeries.data.results,
      ...moreInfo,
    };

    httpResponse(res, "TV Series By Search Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const person = async (req, res, next) => {
  try {
    const { q } = req.query;

    const person = await axiosInstance.get("/search/person", {
      params: {
        query: q,
        page: req.query.page || 1,
      },
    });

    if (person.data.results.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "Person Not Found" }, 404);
    }

    person.data.results = person.data.results.map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true }),
      profile_path: IMG_BASE_URL + p.profile_path,
      popularity: Math.round(p.popularity * 10) / 10,
      known_for: p.known_for.map((item) => ({
        ...item,
        vote_average: Math.round(item.vote_average * 10) / 10,
        popularity: Math.round(item.popularity * 10) / 10,
        slug: item.media_type === "tv" ? slugify(item.name, { lower: true }) : slugify(item.title, { lower: true }),
        poster_path: IMG_BASE_URL + item.poster_path,
        backdrop_path: IMG_BASE_URL + item.backdrop_path,
      })),
    }));

    person.data.total_pages = person.data.total_pages > 500 ? 500 : person.data.total_pages;

    person.data.total_results = person.data.total_pages >= 500 ? person.data.total_pages * person.data.results.length : person.data.total_results;

    const moreInfo = {
      total_results: person.data.total_results,
      total_results_current_page: person.data.results.length,
      current_page: person.data.page,
      total_pages: person.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: person.data.results,
      ...moreInfo,
    };

    httpResponse(res, "Person By Search Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

module.exports = { movie, tv, person };
