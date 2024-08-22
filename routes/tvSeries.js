const express = require("express");
const router = express.Router();
const { getTvSeriesBySearch, getTvSeriesDetail } = require("../controllers/tvSeries");
const { validateSearch, validateIdParams } = require("../middlewares/validationMiddleware");

router.get("/search", validateSearch, getTvSeriesBySearch);
router.get("/:id", validateIdParams, getTvSeriesDetail);

module.exports = router;
