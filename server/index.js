const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000;
const app = express();

// middleware

// app.use(function (req, res, next) {
//   res
//     .header("Access-Control-Allow-Origin", "*")
//     .header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     " GET, POST, PUT, PATCH, POST, DELETE, OPTIONS"
//   );

//   next();
// });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", express.static(__dirname + "converter/output"));

app.use(cors());

// Accessing the path module
const path = require("path");

// Step 1:
app.use(express.static(path.resolve(__dirname, "./build")));
// Step 2:
app.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./build", "index.html"));
});

// express router
//start listening ti request

app.use("/", require("./routes"));

//setup listener
app.listen(port, function (error) {
  if (error) {
    console.log("Error in EXPRESS :: ", error);
    return;
  }
  console.log("Server started at port : ", port);
  return;
});
