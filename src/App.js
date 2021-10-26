import React, { useState } from "react";

var ffmpeg = require("ffmpeg-stream").ffmpeg;
var fs = require("fs");
const conv = ffmpeg();

const frames = [];

const input = conv.input({ f: "image2pipe", r: 30 });
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
conv.run();

function App() {
  const [formValues, setFormValues] = useState([{ url: "" }]);

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

  let handleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(formValues));
  };

  return (
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
  );
}

export default App;
