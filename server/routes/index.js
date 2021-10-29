const express = require("express");
const router = express.Router();

//start listening to request
router.post("/converter", require("../converter"));

module.exports = router;
