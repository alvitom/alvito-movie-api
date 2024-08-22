const express = require("express");
const { createWatchlist, getWatchlist } = require("../controllers/watchlist");
const { auth } = require("../middlewares/auth");
const { validateWatchlist } = require("../middlewares/validationMiddleware");
const router = express.Router();

router.post("/", auth, validateWatchlist, createWatchlist);

router.get("/", auth, getWatchlist);

module.exports = router;
