import React, { useState } from "react";
import { BASE_URL } from "./AppConfig";
// import { img2vid } from "./Converter";

function App() {
  // states for various purposes
  const [formValues, setFormValues] = useState([{ url: "" }]);
  const [uploaded, setUploaded] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [frames, setFrames] = useState([]);
  const [loop, setLoop] = useState(5);
  const [fps, setfps] = useState(25);
  const [loading, setLoading] = useState(false);
  // const loop = 5;
  // const fps = 25;
  // this will be my default audio initially
  const [audioURL, setAudioURL] = useState(
    "https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3"
  );

  // to handle the input change of form
  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let handleLoopChange = (e) => {
    setLoop(e.target.value);
  };
  let handleFpsChange = (e) => {
    setfps(e.target.value);
  };

  // to handle addition or removal of formfield
  let addFormFields = () => {
    setFormValues([...formValues, { url: "" }]);
  };

  // to remove form field
  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  // when user clicks on generate button
  let handleGenerate = async () => {
    setGenerated(false);
    console.log("in React  frames ", frames);
    // send all the urls stored in frames by stringifying it
    let sendBody = JSON.stringify({
      frames: frames,
      fps: fps,
      loop: loop,
    });
    setLoading(true);
    const generateVideo = async () => {
      const response = await fetch(BASE_URL + "/converter/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: sendBody,
      });
      const res = await response.json();
      if (res.status === "complete") {
        console.log("After generate : ", res);
        // ------------------------- Delay added here -------------------------
        setTimeout(() => {
          setGenerated(true);
          setLoading(false);
          setUploaded(false);
        }, frames.length * 2000);
      } else {
        setLoading(false);
        setGenerated(false);
      }
    };
    await generateVideo();
  };

  // handle when audio url is getting changed
  const handleAudioChange = (e) => {
    setAudioURL(e.target.value);
  };

  // handle when user clicks on set audio
  const handleSetAudio = async () => {
    const makeRequest = async () => {
      console.log("submitting......");
      const audioURLtoSend = JSON.stringify({
        audioURL: audioURL,
      });
      console.log("audioURLtoSend ", audioURLtoSend);

      const response = await fetch(BASE_URL + "/converter/setaudio/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: audioURLtoSend,
      });
      const res = await response.json();

      console.log(res);
    };
    await makeRequest();
  };

  // handle when user clicks on submit button
  let handleSubmit = async (event) => {
    console.log("submitting");

    event.preventDefault();
    // img2vid(formValues);
    setUploaded(false);
    setFrames([]);
    setGenerated(false);
    alert(JSON.stringify(formValues));
    let toSend = JSON.stringify(formValues);
    const makeRequest = async () => {
      console.log("submitting......");

      const response = await fetch(BASE_URL + "/converter/convert/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: toSend,
      });
      const res = await response.json();
      if (res.upload === "complete") {
        setFrames(res.frames);
        setUploaded(true);
      }

      console.log(res);
    };
    await makeRequest();
  };
  // App UI
  return (
    <div className="main">
      <h1 style={{ color: "#000" }}>Rajendra's Img2Video Converter</h1>
      {generated && (
        <video
          className="video-player"
          src={BASE_URL + "/converter/output/video/img2video_output.mp4"}
          controls
          autoPlay
        ></video>
      )}
      <div className="video-options" style={{ display: "none" }}>
        <label>Video Settings</label>

        <div className="video-options-left">
          Duration of each image
          <input
            type="number"
            max="10"
            min="1"
            value={loop}
            name="loop"
            onChange={(e) => handleLoopChange(e)}
          />
        </div>
        <div className="video-options-right">
          Frames oer second ( FPS )
          <input
            type="number"
            max="25"
            min="10"
            value={fps}
            name="fps"
            onChange={(e) => handleFpsChange(e)}
          />
        </div>
      </div>
      <div className="audio-input">
        <label>Enter URL of your music </label>
        <div className="audio-input-bar">
          <input
            type="url"
            name="audiourl"
            value={audioURL || ""}
            onChange={(e) => handleAudioChange(e)}
          />
          <button className="button" onClick={() => handleSetAudio()}>
            Set Audio
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="urlForm">
        <label>Enter URLs of your images </label>
        {formValues.map((element, index) => (
          <div className="form-inline" key={index}>
            <input
              type="url"
              name="url"
              value={element.url || ""}
              onChange={(e) => handleChange(index, e)}
            />

            {index ? (
              <button
                type="button"
                className="button remove"
                onClick={() => removeFormFields(index)}
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}

        <div className="button-section">
          <button
            className="button add"
            type="button"
            onClick={() => addFormFields()}
          >
            Add
          </button>
          <button className="button submit" type="submit">
            Submit
          </button>
        </div>
      </form>

      {uploaded && !loading && (
        <button className="button generate" onClick={() => handleGenerate()}>
          Generate Video
        </button>
      )}
      {loading && <h2>Loading...</h2>}
    </div>
  );
}

export default App;
