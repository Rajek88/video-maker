import { ffmpeg } from "ffmpeg-stream";
import { createReadStream } from "fs";
const conv = ffmpeg();

export function Converter(req, res) {
  const frames = [];

  const input = conv.input({ f: "image2pipe", r: 30 });
  conv.output("output.mp4", { vcodec: "libx264", pix_fmt: "yuv420p" });

  frames
    .map(
      (filename) => () =>
        new Promise((fulfill, reject) =>
          createReadStream(filename) //<--- here's the main difference
            .on("end", fulfill)
            .on("error", reject)
            .pipe(input, { end: false })
        )
    )
    .reduce((prev, next) => prev.then(next), Promise.resolve())
    .then(() => {
      input.end();
    });

  conv.run();

  //   const http = require("http"); // or 'https' for https:// URLs
  //   const fs = require("fs");

  //   const file = fs.createWriteStream("./output/file.jpg");
  //   const request = http.get(
  //     "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg",
  //     function (response) {
  //       response.pipe(file);
  //     }
  //   );
}
