const express = require("express");
const router = express.Router();

router.use("/movie", require("./movie"));
router.use("/tv", require("./tvSeries"));
router.use("/person", require("./person"));
router.use("/search", require("./search"));
router.use("/genre", require("./genre"));
router.use("/auth", require("./auth"));
router.use("/watchlist", require("./watchlist"));
router.use("/discover", require("./discover"));
router.use("/trending", require("./trending"));

module.exports = router;
