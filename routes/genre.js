const express = require("express");
const { movie, tv } = require("../controllers/genre");
const router = express.Router();

router.get("/movie", movie);
router.get("/tv", tv);

module.exports = router;
