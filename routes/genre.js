const express = require("express");
const { getGenreMovieList } = require("../controllers/genre");
const router = express.Router();

router.get("/movie", getGenreMovieList);

module.exports = router;
