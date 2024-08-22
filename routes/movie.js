const express = require("express");
const router = express.Router();
const { getMovieNowPlayingList, getMovieDetail, getMovieBySearch, getMovieByGenre, getMoviePopularList, getMovieTopRatedList, getMovieUpcomingList } = require("../controllers/movie");
const { validateSearch, validateIdParams } = require("../middlewares/validationMiddleware");

router.get("/search", validateSearch, getMovieBySearch);
router.get("/now_playing", getMovieNowPlayingList);
router.get("/popular", getMoviePopularList);
router.get("/top_rated", getMovieTopRatedList);
router.get("/upcoming", getMovieUpcomingList);
router.get("/genre/:id", validateIdParams, getMovieByGenre);
router.get("/:id", validateIdParams, getMovieDetail);

module.exports = router;
