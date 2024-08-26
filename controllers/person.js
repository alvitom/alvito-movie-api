const slugify = require("slugify");
const axiosInstance = require("../utils/axiosInstance");
const httpResponse = require("../utils/httpResponse");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const popular = async (req, res, next) => {
  try {
    const personList = await axiosInstance.get("/person/popular", {
      params: {
        page: req.query.page || 1,
      },
    });

    if (personList.data.results.length === 0) {
      return httpResponse(
        res,
        "Request failed with status code 404",
        {
          error: "Person Not Found",
        },
        404
      );
    }

    personList.data.results = personList.data.results.map((person) => ({
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

    personList.data.total_pages = personList.data.total_pages > 500 ? 500 : personList.data.total_pages;

    personList.data.total_results = personList.data.total_pages >= 500 ? personList.data.total_pages * personList.data.results.length : personList.data.total_results;

    const moreInfo = {
      total_results: personList.data.total_results,
      total_results_current_page: personList.data.results.length,
      current_page: personList.data.page,
      total_pages: personList.data.total_pages,
      per_page: 20,
    };

    const data = {
      results: personList.data.results,
      ...moreInfo,
    };

    httpResponse(res, "Person List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const { id } = req.params;

    const person = await axiosInstance.get(`/person/${id}`);

    if (!person.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "Person Not Found" }, 404);
    }

    person.data.popularity = Math.round(person.data.popularity * 10) / 10;
    person.data.birthday = new Date(person.data.birthday).toDateString();
    person.data.deathday = person.data.deathday && new Date(person.data.deathday).toDateString();
    person.data.profile_path = IMG_BASE_URL + person.data.profile_path;

    httpResponse(res, "Person Retrieved Successfully", { result: person.data }, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const movieCredits = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movies = await axiosInstance.get(`/person/${id}/movie_credits`);

    if (movies.data.cast.length === 0 && movies.data.crew.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "Person Not Found" }, 404);
    }

    if (movies.data.cast.length === 0) {
      movies.data.cast = null;
    }

    if (movies.data.crew.length === 0) {
      movies.data.crew = null;
    }

    movies.data.cast = movies.data.cast
      ?.map((movie) => ({
        ...movie,
        release_date: new Date(movie.release_date).toDateString(),
        vote_average: Math.round(movie.vote_average * 10) / 10,
        popularity: Math.round(movie.popularity * 10) / 10,
        slug: slugify(movie.title, { lower: true }),
        poster_path: IMG_BASE_URL + movie.poster_path,
        backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      }))
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    movies.data.crew = movies.data.crew
      ?.map((movie) => ({
        ...movie,
        release_date: new Date(movie.release_date).toDateString(),
        vote_average: Math.round(movie.vote_average * 10) / 10,
        popularity: Math.round(movie.popularity * 10) / 10,
        slug: slugify(movie.title, { lower: true }),
        poster_path: IMG_BASE_URL + movie.poster_path,
        backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      }))
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    const data = {
      results: {
        cast: movies.data.cast,
        crew: movies.data.crew,
      },
      total_results: {
        cast: movies.data.cast?.length,
        crew: movies.data.crew?.length,
      },
    };

    httpResponse(res, "Person Movie List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const tvCredits = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tv = await axiosInstance.get(`/person/${id}/tv_credits`);

    if (tv.data.cast.length === 0 && tv.data.crew.length === 0) {
      return httpResponse(res, "Request failed with status code 404", { error: "Person Not Found" }, 404);
    }

    if (tv.data.cast.length === 0) {
      tv.data.cast = null;
    }

    if (tv.data.crew.length === 0) {
      tv.data.crew = null;
    }

    tv.data.cast = tv.data.cast
      ?.map((movie) => ({
        ...movie,
        first_air_date: new Date(movie.first_air_date).toDateString(),
        vote_average: Math.round(movie.vote_average * 10) / 10,
        popularity: Math.round(movie.popularity * 10) / 10,
        slug: slugify(movie.name, { lower: true }),
        poster_path: IMG_BASE_URL + movie.poster_path,
        backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      }))
      .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));

    tv.data.crew = tv.data.crew
      ?.map((movie) => ({
        ...movie,
        first_air_date: new Date(movie.first_air_date).toDateString(),
        vote_average: Math.round(movie.vote_average * 10) / 10,
        popularity: Math.round(movie.popularity * 10) / 10,
        slug: slugify(movie.name, { lower: true }),
        poster_path: IMG_BASE_URL + movie.poster_path,
        backdrop_path: IMG_BASE_URL + movie.backdrop_path,
      }))
      .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));

    const data = {
      results: {
        cast: tv.data.cast,
        crew: tv.data.crew,
      },
      total_results: {
        cast: tv.data.cast?.length,
        crew: tv.data.crew?.length,
      },
    };

    httpResponse(res, "Person Tv List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

module.exports = { popular, show, movieCredits, tvCredits };
