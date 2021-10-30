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
    .save("../server/converter/output/video/img2video_output.mp4")
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

  // const status = await generateVideo(frames);
  return res.status(200).json({
    upload: "complete",
  });
};

//I can send the processed array to response then the convert btn will get activated
//and then when I click convert this new array is passed and now this time  it will create new video

//to do : create new route Generate Video which will give me link

module.exports.Generator = async (req, res) => {
  const status = await generateVideo(frames);
  return res.status(200).json({
    status: status,
    videoURL:
      "http://localhost:8000/converter/output/video/img2video_output.mp4",
  });
};

module.exports.ShowVideo = (req, res) => {
  var stat = fs.statSync(
    "../server/converter/output/video/img2video_output.mp4"
  );
  // res.setHeader(`Content-Type: video/mpeg, Content-Length : ${stat.size}`);
  // var range = req.headers.range;
  // if (!range) {
  //   // 416 Wrong range
  //   return res.sendStatus(416);
  // }
  // var positions = range.replace(/bytes=/, "").split("-");
  // var start = parseInt(positions[0], 10);
  // var total = stat.size;
  // var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
  // var chunksize = end - start + 1;

  // res.setHeader(206, {
  //   "Content-Range": "bytes " + start + "-" + end + "/" + total,
  //   "Accept-Ranges": "bytes",
  //   "Content-Length": chunksize,
  //   "Content-Type": "video/mp4",
  // });

  console.log("Showing Video");
  // return res.end(
  //   `<video src="http://localhost:8000/converter/output/video/img2video_output.mp4">
  //     Video
  //   </video>`
  // );
  return res.sendFile(
    __dirname + "/output/video/img2video_output.mp4",
    function (err) {
      if (err) {
        console.log("error in serving video :: ", err);
      } else {
        console.log("File Sent in response");
      }
    }
  );
};
