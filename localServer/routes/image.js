const express = require("express");

const imageController = require("../controllers/image");

const router = express.Router();

router.post("/add", imageController.addImage);
router.get("/", imageController.getImages);

module.exports = router;