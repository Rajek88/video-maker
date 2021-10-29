const express = require("express");
const router = express.Router();

//start listening to request
console.log("App is running Node : in /routes");
router.use("/converter", require("../converter"));

module.exports = router;
