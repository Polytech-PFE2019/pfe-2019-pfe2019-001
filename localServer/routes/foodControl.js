const express = require("express");

const foodController = require("../controllers/foodControl");

const router = express.Router();

router.post("", foodController.setValue);

router.post("", foodController.setEtalon);

router.get("", foodController.getValue);



module.exports = router;