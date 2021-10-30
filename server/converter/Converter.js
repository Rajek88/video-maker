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
const fsExtra = require("fs-extra");
const sharp = require("sharp");
// const conv = new ffmpeg.Converter();

let count = 0;

// this is download function which will download our image files
var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri)
      .pipe(
        fs.createWriteStream(
          path.join("../server/converter/images/", "img" + filename)
        )
      )
      .on(
        "close",
        function () {
          sharp(__dirname + "/images/img" + filename)
            .resize(640, 480)
            .jpeg({ quality: 100 })
            .toFile(__dirname + "/converted_images/img" + filename)
            .then((data) => {
              console.log("Done Resizing");
              return;
            });
        },
        callback
      );
  });
  count++;
};

// this wil be get triggered when user clicks on submit button
module.exports.Converter = async function (req, res) {
  console.log("Req by React : ", req.body);
  let imgUrlObj = req.body;
  // first pushing my photo
  imgUrlObj = [
    "https://raw.githubusercontent.com/Rajek88/hosted-images/main/forImg2VideoApp.png",
    ...imgUrlObj,
  ];

  let frames = [];

  try {
    await imgUrlObj.forEach((url) => {
      download(url, count + ".jpeg", function () {
        console.log("done");
      });
      frames.push(
        path.join(
          "../server/converter/converted_images/",
          "img" + (count - 1) + ".jpeg"
        )
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

// this will get triggered when user clicks on generate button
module.exports.Generator = async (req, res) => {
  //generate video with following options

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
        .audio(
          "https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3"
        )
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
          fsExtra.emptyDirSync("../server/converter/images/");
          fsExtra.emptyDirSync("../server/converter/converted_images/");
          return res.status(200).json({
            status: "complete",
            videoURL:
              "http://localhost:8000/converter/output/video/img2video_output.mp4",
          });
        });
    } catch (error) {
      return "error";
    }
  };

  //handle req
  console.log("in Generator : ", req.body);
  let frames = req.body;

  try {
    const status = await generateVideo(frames);

    // console.log("generate status : ", status);
  } catch (error) {
    return res.status(200).json({
      status: "incomplete",
      videoURL:
        "http://localhost:8000/converter/output/video/img2video_output.mp4",
    });
  }
};

// this will be get triggered by the UI when Generate is completed

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

// this will get triggerd when user wants to set music
module.exports.SetAudio = (req, res) => {
  const audioURL = req.body.audioURL;
  console.log("Trying to set audio ", req);
  request.head(audioURL, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(audioURL)
      .pipe(
        fs.createWriteStream(path.join("../server/converter/audio/audio.mp3"))
      )
      .on("close", () => {
        return res.status(200).json({
          status: "complete",
        });
      });
  });

  return res.status(200).json({
    status: "incomplete",
  });
};
