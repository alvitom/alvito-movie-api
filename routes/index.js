const express = require("express");
const router = express.Router();

router.use("/movie", require("./movie"));
router.use("/tv", require("./tvSeries"));
router.use("/genre", require("./genre"));
router.use("/auth", require("./auth"));
router.use("/watchlist", require("./watchlist"));

module.exports = router;
