const express = require("express");

const foodController = require("../controllers/foodControl");

const router = express.Router();

router.post("/setEtalon", foodController.setEtalon);

router.get("/etalon", foodController.getEtalon);

router.post("/dataBaseUpdate", foodController.dataBaseUpdate);

module.exports = router;
