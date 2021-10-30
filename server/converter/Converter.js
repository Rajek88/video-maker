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

  try {
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
  } catch (error) {
    return "error";
  }
};

module.exports.Converter = async function (req, res) {
  console.log("Req by React : ", req.body);
  const imgUrlObj = req.body;

  const frames = [];
  try {
    await imgUrlObj.forEach((url) => {
      download(url, count + ".jpeg", function () {
        console.log("done");
      });
      frames.push(
        path.join("../server/converter/output/", "img" + (count - 1) + ".jpeg")
      );
    });

    console.log("Frames ::: ", frames);

    return res.status(200).json({
      upload: "complete",
      frames: frames,
    });
  } catch (error) {
    return res.status(200).json({
      upload: "incomplete",
      frames: frames,
    });
  }
};

//I can send the processed array to response then the convert btn will get activated
//and then when I click convert this new array is passed and now this time  it will create new video

//to do : create new route Generate Video which will give me link

module.exports.Generator = async (req, res) => {
  console.log("in Generator : ", req.body);
  let frames = req.body;
  try {
    const status = await generateVideo(frames);
    // console.log("generate status : ", status);
    return res.status(200).json({
      status: "complete",
      videoURL:
        "http://localhost:8000/converter/output/video/img2video_output.mp4",
    });
  } catch (error) {
    return res.status(200).json({
      status: "incomplete",
      videoURL:
        "http://localhost:8000/converter/output/video/img2video_output.mp4",
    });
  }
};

module.exports.ShowVideo = (req, res) => {
  console.log("Showing Video");

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
