export function img2vid(imgUrlObj) {
  var canvas = document.querySelector("#canvas");
  var rec = document.querySelector("#rec");
  console.log(imgUrlObj);

  const frames = [];

  for (let i of imgUrlObj) {
    frames.push(i.url);
  }

  console.log("imgArray : ", frames);
  var cStream,
    recorder,
    chunks = [];

  rec.onclick = function () {
    this.textContent = "stop recording";
    // set the framerate to 30FPS
    cStream = canvas.captureStream(30);
    // create a recorder fed with our canvas' stream
    recorder = new MediaRecorder(cStream);
    // start it
    recorder.start();
    // save the chunks
    recorder.ondataavailable = saveChunks;

    recorder.onstop = exportStream;
    // change our button's function
    this.onclick = stopRecording;
  };

  function saveChunks(e) {
    chunks.push(e.data);
  }

  function stopRecording() {
    recorder.stop();
  }

  function exportStream(e) {
    // combine all our chunks in one blob
    var blob = new Blob(chunks);
    // do something with this blob
    var vidURL = URL.createObjectURL(blob);
    var vid = document.createElement("video");
    vid.controls = true;
    vid.src = vidURL;
    vid.onended = function () {
      URL.revokeObjectURL(vidURL);
    };
    document.body.insertBefore(vid, canvas);
  }

  // make something move on the canvas
  var x = 0;
  var ctx = canvas.getContext("2d");

  var anim = function () {
    x = (x + 2) % (canvas.width + 100);
    // there is no transparency in webm,
    // so we need to set a background otherwise every transparent pixel will become opaque black
    ctx.fillStyle = "ivory";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(x - 50, 20, 50, 50);
    requestAnimationFrame(anim);
  };
  anim();
}
