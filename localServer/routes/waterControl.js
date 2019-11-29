const express = require("express");

const waterController = require("../controllers/waterControl");


const router = express.Router();

router.post("", waterController.setValue);

module.exports = router;
