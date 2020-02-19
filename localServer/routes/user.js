const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/add", userController.addEmail);
router.post("/set", userController.setEmail);
router.get("/", userController.getEmail);


module.exports = router;