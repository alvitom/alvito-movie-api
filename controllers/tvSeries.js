const slugify = require("slugify");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/response");
const axiosInstance = require("../utils/axiosInstance");
const IMG_BASE_URL = process.env.TMDB_IMG_BASE_URL;

const getTvSeriesBySearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  try {
    const tvSeries = await axiosInstance.get("/search/tv", {
      params: {
        query: q,
        page: req.query.page || 1,
      },
    });

    if (tvSeries.data.results.length === 0) {
      return ApiResponse.error(res, "TV Series Not Found", "TV Series Not Found", 404);
    }

    tvSeries.data.results = tvSeries.data.results.map((tv) => ({
      ...tv,
      backdrop_path: IMG_BASE_URL + tv.backdrop_path,
      poster_path: IMG_BASE_URL + tv.poster_path,
      release_date: new Date(tv.release_date).toDateString(),
      popularity: Math.round(tv.popularity * 10) / 10,
      vote_average: Math.round(tv.vote_average * 10) / 10,
      slug: slugify(tv.name, { lower: true }),
    }));

    tvSeries.data.total_pages = tvSeries.data.total_pages > 500 ? 500 : tvSeries.data.total_pages;

    const paginationInfo = {
      first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=1`,
      last_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=${tvSeries.data.total_pages}`,
      prev_page_url: req.query.page > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=${parseInt(req.query.page) - 1}` : null,
      next_page_url: !req.query.page
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=2`
        : req.query.page < tvSeries.data.total_pages
        ? `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}&page=${parseInt(req.query.page) + 1}`
        : null,
      current_page: tvSeries.data.page,
      last_page: tvSeries.data.total_pages,
      from: tvSeries.data.results[0].id,
      to: tvSeries.data.results[tvSeries.data.results.length - 1].id,
      total: tvSeries.data.total_results,
      path: `${req.protocol}://${req.get("host")}${req.originalUrl.replace(/&page=\d+/, "")}`,
      per_page: tvSeries.data.results.length,
    };

    ApiResponse.pagination(res, tvSeries.data.results, paginationInfo, "Tv Series By Search Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Tv Series By Search Not Found", status_message, 404);
  }
});

const getTvSeriesDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const tvSeries = await axiosInstance.get(`/tv/${id}`);

    if (!tvSeries.data) {
      return ApiResponse.error(res, "TV Series Not Found", "TV Series Not Found", 404);
    }

    const credits = await axiosInstance.get(`/tv/${id}/credits`);

    if (!credits.data) {
      credits.data = null;
    }

    const videos = await axiosInstance.get(`/tv/${id}/videos`);

    if (!videos.data) {
      videos.data = null;
    }

    const images = await axiosInstance.get(`/tv/${id}/images`);

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
    tvSeries.data.backdrop_path = IMG_BASE_URL + tvSeries.data.backdrop_path;

    // belongs_to_collection
    if (tvSeries.data.belongs_to_collection) {
      tvSeries.data.belongs_to_collection.poster_path = IMG_BASE_URL + tvSeries.data.belongs_to_collection.poster_path;
      tvSeries.data.belongs_to_collection.backdrop_path = IMG_BASE_URL + tvSeries.data.belongs_to_collection.backdrop_path;
    }

    // creators
    tvSeries.data.created_by = tvSeries.data.created_by?.map((creator) => ({
      ...creator,
      profile_path: IMG_BASE_URL + creator.profile_path,
    }));

    // last_episode_to_air
    if (tvSeries.data.last_episode_to_air) {
      tvSeries.data.last_episode_to_air.still_path = IMG_BASE_URL + tvSeries.data.last_episode_to_air.still_path;
    }

    // networks
    tvSeries.data.networks = tvSeries.data.networks?.map((network) => ({
      ...network,
      logo_path: IMG_BASE_URL + network.logo_path,
    }));

    // seasons
    tvSeries.data.seasons = tvSeries.data.seasons?.map((season) => ({
      ...season,
      poster_path: IMG_BASE_URL + season.poster_path,
    }));

    // poster_path
    tvSeries.data.poster_path = IMG_BASE_URL + tvSeries.data.poster_path;

    // production_companies
    tvSeries.data.production_companies = tvSeries.data.production_companies?.map((company) => ({
      ...company,
      logo_path: IMG_BASE_URL + company.logo_path,
    }));

    // release_date
    tvSeries.data.release_date = new Date(tvSeries.data.release_date).toDateString();

    // popularity
    tvSeries.data.popularity = Math.round(tvSeries.data.popularity * 10) / 10;

    // vote_average
    tvSeries.data.vote_average = Math.round(tvSeries.data.vote_average * 10) / 10;

    // slug
    tvSeries.data.slug = slugify(tvSeries.data.name, { lower: true });

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

    ApiResponse.show(res, { ...tvSeries.data }, { credits: credits.data, videos: videos.data, images: images.data }, "Tv Series Detail Retrieved Successfully");
  } catch (error) {
    const { status_message } = error.response.data;
    return ApiResponse.error(res, "Tv Series Detail Not Found", status_message, 404);
  }
});

module.exports = { getTvSeriesBySearch, getTvSeriesDetail };
