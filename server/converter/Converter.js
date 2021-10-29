var ffmpeg = require("ffmpeg-stream");
var fs = require("fs");
const conv = new ffmpeg.Converter();

module.exports.Converter = function (req, res) {
  console.log("Req by React : ", req);

  const frames = [];

  const input = conv({ f: "image2pipe", r: 30 });
  conv.output("out.mp4", { vcodec: "libx264", pix_fmt: "yuv420p" });

  frames
    .map(
      (filename) => () =>
        new Promise((fulfill, reject) =>
          fs
            .createReadStream(filename) //<--- here's the main difference
            .on("end", fulfill)
            .on("error", reject)
            .pipe(input, { end: false })
        )
    )
    .reduce((prev, next) => prev.then(next), Promise.resolve())
    .then(() => input.end());
};
