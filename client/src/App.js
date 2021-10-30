import React, { useState } from "react";
// import { img2vid } from "./Converter";

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
      console.log(res);
    };
    makeRequest();
  };

  return (
    <div>
      <canvas id="canvas" width="500" height="200"></canvas>
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
    </div>
  );
}

export default App;
