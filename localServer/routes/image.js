const express = require("express");

const imageController = require("../controllers/image");

const router = express.Router();

router.post("/add", imageController.addImage);
router.post("/remove", imageController.deleteImage);
router.post("/move", imageController.moveImage);

router.get("/video/:name", imageController.getVideo);
router.get("/:name", imageController.getImgInAlbums);
router.get("/", imageController.getAlbums);



module.exports = router;
