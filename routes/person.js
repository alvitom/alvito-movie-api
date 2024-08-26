const express = require("express");
const router = express.Router();
const { popular, show, movieCredits, tvCredits } = require("../controllers/person");

router.get("/", popular);
router.get("/:id", show);
router.get("/:id/movies", movieCredits);
router.get("/:id/tv", tvCredits);

module.exports = router;
