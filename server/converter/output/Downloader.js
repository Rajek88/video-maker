const http = require("http"); // or 'https' for https:// URLs
const fs = require("fs");

const file = fs.createWriteStream("file.jpg");
const request = http.get(
  "/converter/output/download/output.mp4",
  function (response) {
    response.pipe(file);
  }
);
