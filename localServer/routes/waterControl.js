const express = require("express");

const waterController = require("../controllers/waterControl");


const router = express.Router();

router.post("", waterController.setValue);

router.get("", waterController.getValue)



module.exports = router;
