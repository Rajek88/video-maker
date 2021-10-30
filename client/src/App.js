import React, { useState } from "react";
// import { img2vid } from "./Converter";

function App() {
  const [formValues, setFormValues] = useState([{ url: "" }]);
  const [uploaded, setUploaded] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [frames, setFrames] = useState([]);

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
      console.log("After generate : ", res);
      setGenerated(true);
    };
    generateVideo();
  };

  let handleSubmit = (event) => {
    console.log("submitting");

    event.preventDefault();
    // img2vid(formValues);
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
    <div>
      {generated && (
        <video
          src="http://localhost:8000/converter/output/video/img2video_output.mp4"
          controls
          autoPlay
        ></video>
      )}
      <form onSubmit={handleSubmit}>
        {formValues.map((element, index) => (
          <div className="form-inline" key={index}>
            <label>URL</label>
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
        <button onClick={() => handleGenerate()}>Generate Video</button>
      )}
    </div>
  );
}

export default App;
