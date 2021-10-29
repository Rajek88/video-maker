const express = require("express");
const port = 8000;
const app = express();

// middleware
// express router
//start listening ti request

app.use("/", require("./routes"));
console.log("Server started at port : ", port);

//setup listener
app.listen(port, function (error) {
  if (error) {
    console.log("Error in EXPRESS :: ", error);
    return;
  }
});
