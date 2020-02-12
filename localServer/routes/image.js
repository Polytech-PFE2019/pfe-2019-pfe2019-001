const express = require("express");

const imageController = require("../controllers/image");

const router = express.Router();

router.post("/add", imageController.addImage);
router.get("/video/:name", imageController.getVideo);
router.get("/:name", imageController.getImgInAlbums);
router.get("/", imageController.getAlbums);


module.exports = router;
