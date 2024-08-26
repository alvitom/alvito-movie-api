const express = require("express");
const router = express.Router();
const { nowPlaying, popular, topRated, upcoming, show, credits, images, videos } = require("../controllers/movie");

router.get("/now_playing", nowPlaying);
router.get("/popular", popular);
router.get("/top_rated", topRated);
router.get("/upcoming", upcoming);
router.get("/:id", show);
router.get("/:id/credits", credits);
router.get("/:id/images", images);
router.get("/:id/videos", videos);

module.exports = router;
