// const ffmpeg = require("ffmpeg-stream");
var videoshow = require("videoshow");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const request = require("request");
var fs = require("fs");
const path = require("path");
// const conv = new ffmpeg.Converter();

let count = 0;

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri)
      .pipe(
        fs.createWriteStream(
          path.join("../server/converter/output/", "img" + filename)
        )
      )
      .on("close", callback);
  });
  count++;
};

const generateVideo = async (frames) => {
  var videoOptions = {
    fps: 25,
    loop: 5, // seconds
    transition: true,
    transitionDuration: 1, // seconds
    videoBitrate: 1024,
    videoCodec: "libx264",
    size: "640x?",
    audioBitrate: "128k",
    audioChannels: 2,
    format: "mp4",
    pixelFormat: "yuv420p",
  };

  await videoshow(frames, videoOptions)
    // .audio("song.mp3")
    .save("video.mp4")
    .on("start", function (command) {
      console.log("ffmpeg process started:", command);
    })
    .on("error", function (err, stdout, stderr) {
      console.error("Error:", err);
      console.error("ffmpeg stderr:", stderr);
      return "error";
    })
    .on("end", function (output) {
      console.error("Video created in:", output);
      return "success";
    });
};

module.exports.Converter = async function (req, res) {
  console.log("Req by React : ", req.body);
  const imgUrlObj = req.body;

  const frames = [];
  await imgUrlObj.forEach((url) => {
    download(url, count + ".jpeg", function () {
      console.log("done");
    });
    frames.push(
      path.join("../server/converter/output/", "img" + (count - 1) + ".jpeg")
    );
  });

  console.log("Frames ::: ", frames);

  // const input = conv.input({ f: "image2pipe", r: 30 });
  // conv.output("out.mp4", { vcodec: "libx264", pix_fmt: "yuv420p" });

  // console.log(frames);
  // frames
  //   .map(
  //     (filename) => () =>
  //       new Promise((fulfill, reject) =>
  //         fs
  //           .createReadStream(filename) //<--- here's the main difference
  //           .on("end", fulfill)
  //           .on("error", reject)
  //           .pipe(input, { end: false })
  //       )
  //   )
  //   .reduce((prev, next) => prev.then(next), Promise.resolve())
  //   .then(() => input.end())
  //   .catch((err) => console.log("Error in conversion : ", err));
  // conv.run();

  // with Videoshow

  // var images = ["step1.jpg", "step2.jpg", "step3.jpg", "step4.jpg"];

  const status = await generateVideo(frames);
  return res.status(200).json({
    message: status,
  });
};
