const express = require("express");
const router = express.Router();
const { movie, tv, person } = require("../controllers/search");
const { validateSearch } = require("../middlewares/validationMiddleware");

router.get("/movie", validateSearch, movie);
router.get("/tv", validateSearch, tv);
router.get("/person", validateSearch, person);

module.exports = router;
