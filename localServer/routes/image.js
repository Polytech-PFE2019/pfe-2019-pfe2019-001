const express = require("express");

const imageController = require("../controllers/image");

const router = express.Router();

router.post("/add", imageController.addImage);
router.get("/:name", imageController.getImgInAlbums);
router.get("/", imageController.getAlbums);


module.exports = router;