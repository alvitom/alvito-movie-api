const slugify = require("slugify");
const axiosInstance = require("../utils/axiosInstance");
const httpResponse = require("../utils/httpResponse");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const nowPlaying = async (req, res, next) => {
  try {
    const movies = await axiosInstance.get("/movie/now_playing", {
      params: {
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

    httpResponse(res, "Movie Now Playing List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const popular = async (req, res, next) => {
  try {
    const movies = await axiosInstance.get("/movie/popular", {
      params: {
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

    httpResponse(res, "Movie Popular List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const topRated = async (req, res, next) => {
  try {
    const movies = await axiosInstance.get("/movie/top_rated", {
      params: {
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

    httpResponse(res, "Movie Top Rated List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const upcoming = async (req, res, next) => {
  try {
    const movies = await axiosInstance.get("/movie/upcoming", {
      params: {
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

    httpResponse(res, "Movie Upcoming List Retrieved Successfully", data, 200);
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

    const movie = await axiosInstance.get(`/movie/${id}`);

    if (!movie.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "Movie Not Found" }, 404);
    }

    movie.data.backdrop_path = IMG_BASE_URL + movie.data.backdrop_path;

    if (movie.data.belongs_to_collection) {
      movie.data.belongs_to_collection.poster_path = IMG_BASE_URL + movie.data.belongs_to_collection.poster_path;
      movie.data.belongs_to_collection.backdrop_path = IMG_BASE_URL + movie.data.belongs_to_collection.backdrop_path;
    }

    movie.data.poster_path = IMG_BASE_URL + movie.data.poster_path;

    movie.data.production_companies = movie.data.production_companies?.map((company) => ({
      ...company,
      logo_path: IMG_BASE_URL + company.logo_path,
    }));
    
    movie.data.release_date = new Date(movie.data.release_date).toDateString();
    movie.data.popularity = Math.round(movie.data.popularity * 10) / 10;
    movie.data.vote_average = Math.round(movie.data.vote_average * 10) / 10;
    movie.data.slug = slugify(movie.data.title, { lower: true });

    httpResponse(res, "Movie Detail Retrieved Successfully", { result: movie.data }, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const credits = async (req, res, next) => {
  try {
    const { id } = req.params;

    const credits = await axiosInstance.get(`/movie/${id}/credits`);

    if (!credits.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "Credits Not Found" }, 404);
    }

    if (credits.data.cast.length === 0) {
      credits.data.cast = null;
    }

    if (credits.data.crew.length === 0) {
      credits.data.crew = null;
    }

    credits.data.cast = credits.data.cast?.map((cast) => ({
      ...cast,
      profile_path: IMG_BASE_URL + cast.profile_path,
    }));
    credits.data.crew = credits.data.crew?.map((crew) => ({
      ...crew,
      profile_path: IMG_BASE_URL + crew.profile_path,
    }));

    httpResponse(res, "Credits Retrieved Successfully", { result: credits.data }, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const images = async (req, res, next) => {
  try {
    const { id } = req.params;

    const images = await axiosInstance.get(`/movie/${id}/images`);

    if (!images.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "Images Not Found" }, 404);
    }

    if (images.data.backdrops.length === 0) {
      images.data.backdrops = null;
    }

    if (images.data.logos.length === 0) {
      images.data.logos = null;
    }

    if (images.data.posters.length === 0) {
      images.data.posters = null;
    }

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

    httpResponse(res, "Images Retrieved Successfully", { result: images.data }, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const videos = async (req, res, next) => {
  try {
    const { id } = req.params;

    const videos = await axiosInstance.get(`/movie/${id}/videos`);

    if (!videos.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "Videos Not Found" }, 404);
    }

    if (videos.data.results.length === 0) {
      videos.data.results = null;
    }

    httpResponse(res, "Videos Retrieved Successfully", { result: videos.data }, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

module.exports = { nowPlaying, popular, topRated, upcoming, show, credits, images, videos };
