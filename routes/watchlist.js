const express = require("express");
const { store, movies, tv, destroy, destroyAll } = require("../controllers/watchlist");
const { auth } = require("../middlewares/auth");
const { validateWatchlist } = require("../middlewares/validationMiddleware");
const router = express.Router();

router.post("/", auth, validateWatchlist, store);

router.get("/movies", auth, movies);
router.get("/tv", auth, tv);

router.delete("/", auth, destroyAll);
router.delete("/:watchlistId", auth, destroy);

module.exports = router;
