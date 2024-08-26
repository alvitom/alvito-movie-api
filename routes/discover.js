const express = require("express");
const router = express.Router();
const { movie, tv } = require("../controllers/discover");

router.get("/movie", movie);
router.get("/tv", tv);

module.exports = router;
