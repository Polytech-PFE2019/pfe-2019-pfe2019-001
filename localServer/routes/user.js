const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/", userController.setEmail);
router.get("/", userController.getEmail);


module.exports = router;