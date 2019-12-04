const express = require("express");

const foodController = require("../controllers/foodControl");

const router = express.Router();

router.post("/setValue", foodController.setValue);

router.post("/setEtalon", foodController.setEtalon);

// router.get("", foodController.getValue);



module.exports = router;