import express from "express";
const port = 8000;
const app = express();

// middleware
// express router

app.use("/", require("./routes").default);

//start listening ti request

//setup listener
app.listen(port, function (error) {
  if (error) {
    console.log("Error in EXPRESS :: ", error);
    return;
  }
});
