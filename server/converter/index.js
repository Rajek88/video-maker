const express = require("express");
const { Converter } = require("./Converter");
const router = express.Router();

console.log("App is running Node : in /routes/converter");

//start listening to request
router.post("/convert", Converter);

module.exports = router;
