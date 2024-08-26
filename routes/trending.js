const express = require("express");
const router = express.Router();
const { movie, tv, person } = require("../controllers/trending");

router.get("/movie/:timeWindow", movie);
router.get("/tv/:timeWindow", tv);
router.get("/person/:timeWindow", person);

module.exports = router;
