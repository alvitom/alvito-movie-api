const express = require("express");
const { store, movies, tv } = require("../controllers/watchlist");
const { auth } = require("../middlewares/auth");
const { validateWatchlist } = require("../middlewares/validationMiddleware");
const router = express.Router();

router.post("/", auth, validateWatchlist, store);

router.get("/movies", auth, movies);
router.get("/tv", auth, tv);

module.exports = router;
