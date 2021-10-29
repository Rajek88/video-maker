const express = require("express");
const { Converter } = require("./Converter");
const router = express.Router();

//start listening to request
router.post("/convert", Converter);

module.exports = router;
