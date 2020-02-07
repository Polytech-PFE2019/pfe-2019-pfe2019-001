const express = require("express");

const statsController = require("../controllers/stats");

const router = express.Router();

router.post("/add", statsController.addStat);
router.get("/:type", statsController.getAverage);
router.get("/", statsController.getStats);


module.exports = router;