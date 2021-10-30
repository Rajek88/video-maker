const express = require("express");
const { Converter, Generator, ShowVideo } = require("./Converter");
const router = express.Router();

console.log("App is running Node : in /routes/converter");

//start listening to request
router.post("/convert", Converter);
router.post("/generate", Generator);
router.get("/output/video/img2video_output.mp4", ShowVideo);

module.exports = router;
