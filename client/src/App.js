import React, { useState } from "react";
// import { img2vid } from "./Converter";

function App() {
  const [formValues, setFormValues] = useState([{ url: "" }]);
  const [uploaded, setUploaded] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [frames, setFrames] = useState([]);
  const [audioURL, setAudioURL] = useState(
    "https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3"
  );

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { url: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let handleGenerate = () => {
    setGenerated(false);
    console.log("in React  frames ", frames);
    let sendFrames = JSON.stringify(frames);
    const generateVideo = async () => {
      const response = await fetch(
        "http://localhost:8000/converter/generate/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: sendFrames,
        }
      );
      const res = await response.json();
      if (res.status === "complete") {
        console.log("After generate : ", res);
        setTimeout(() => {
          setGenerated(true);
          setUploaded(false);
        }, frames.length * 1200);
      } else {
        setGenerated(false);
      }
    };
    generateVideo();
  };

  const handleAudioChange = (e) => {
    setAudioURL(e.target.value);
  };

  const handleSetAudio = () => {
    const makeRequest = async () => {
      console.log("submitting......");
      const audioURLtoSend = JSON.stringify({
        audioURL: audioURL,
      });
      console.log("audioURLtoSend ", audioURLtoSend);

      const response = await fetch(
        "http://localhost:8000/converter/setaudio/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: audioURLtoSend,
        }
      );
      const res = await response.json();

      console.log(res);
    };
    makeRequest();
  };

  let handleSubmit = (event) => {
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

      const response = await fetch("http://localhost:8000/converter/convert/", {
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
    makeRequest();
  };

  return (
    <div className="main">
      {generated && (
        <video
          className="video-player"
          src="http://localhost:8000/converter/output/video/img2video_output.mp4"
          controls
          autoPlay
        ></video>
      )}
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

      {uploaded && (
        <button className="button generate" onClick={() => handleGenerate()}>
          Generate Video
        </button>
      )}
    </div>
  );
}

export default App;
