const express = require("express");
const router = express.Router();
const { airingToday, onTheAir, popular, topRated, show, credits, images, videos } = require("../controllers/tvSeries");

router.get("/airing_today", airingToday);
router.get("/on_the_air", onTheAir);
router.get("/popular", popular);
router.get("/top_rated", topRated);
router.get("/:id", show);
router.get("/:id/credits", credits);
router.get("/:id/images", images);
router.get("/:id/videos", videos);

module.exports = router;
