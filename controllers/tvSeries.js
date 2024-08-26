const slugify = require("slugify");
const axiosInstance = require("../utils/axiosInstance");
const httpResponse = require("../utils/httpResponse");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const airingToday = async (req, res, next) => {
  try {
    const tvSeries = await axiosInstance.get("/tv/airing_today", {
      params: {
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

    httpResponse(res, "TV Series Airing Today List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const onTheAir = async (req, res, next) => {
  try {
    const tvSeries = await axiosInstance.get("/tv/on_the_air", {
      params: {
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

    httpResponse(res, "TV Series On The Air List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const popular = async (req, res, next) => {
  try {
    const tvSeries = await axiosInstance.get("/tv/popular", {
      params: {
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

    httpResponse(res, "TV Series Popular List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const topRated = async (req, res, next) => {
  try {
    const tvSeries = await axiosInstance.get("/tv/top_rated", {
      params: {
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

    httpResponse(res, "TV Series Top Rated List Retrieved Successfully", data, 200);
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

    const tvSeries = await axiosInstance.get(`/tv/${id}`);

    if (!tvSeries.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "TV Series Not Found" }, 404);
    }

    tvSeries.data.backdrop_path = IMG_BASE_URL + tvSeries.data.backdrop_path;

    if (tvSeries.data.belongs_to_collection) {
      tvSeries.data.belongs_to_collection.poster_path = IMG_BASE_URL + tvSeries.data.belongs_to_collection.poster_path;
      tvSeries.data.belongs_to_collection.backdrop_path = IMG_BASE_URL + tvSeries.data.belongs_to_collection.backdrop_path;
    }

    tvSeries.data.created_by = tvSeries.data.created_by?.map((creator) => ({
      ...creator,
      profile_path: IMG_BASE_URL + creator.profile_path,
    }));

    if (tvSeries.data.last_episode_to_air) {
      tvSeries.data.last_episode_to_air.still_path = IMG_BASE_URL + tvSeries.data.last_episode_to_air.still_path;
    }

    tvSeries.data.networks = tvSeries.data.networks?.map((network) => ({
      ...network,
      logo_path: IMG_BASE_URL + network.logo_path,
    }));

    tvSeries.data.seasons = tvSeries.data.seasons?.map((season) => ({
      ...season,
      poster_path: IMG_BASE_URL + season.poster_path,
    }));

    tvSeries.data.poster_path = IMG_BASE_URL + tvSeries.data.poster_path;

    tvSeries.data.production_companies = tvSeries.data.production_companies?.map((company) => ({
      ...company,
      logo_path: IMG_BASE_URL + company.logo_path,
    }));

    tvSeries.data.first_air_date = new Date(tvSeries.data.first_air_date).toDateString();
    tvSeries.data.popularity = Math.round(tvSeries.data.popularity * 10) / 10;
    tvSeries.data.vote_average = Math.round(tvSeries.data.vote_average * 10) / 10;
    tvSeries.data.slug = slugify(tvSeries.data.name, { lower: true });

    httpResponse(res, "Tv Series Detail Retrieved Successfully", { result: tvSeries.data }, 200);
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

    const credits = await axiosInstance.get(`/tv/${id}/credits`);

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

    const images = await axiosInstance.get(`/tv/${id}/images`);

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

    const videos = await axiosInstance.get(`/tv/${id}/videos`);

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

module.exports = { airingToday, onTheAir, popular, topRated, show, credits, images, videos };
