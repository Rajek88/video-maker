const express = require("express");
const cors = require("cors");
const { app, BrowserWindow } = require("electron");
const port = 3000;
const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use(cors());

// Accessing the path module
const path = require("path");

// Step 1:
server.use(express.static(path.resolve(__dirname, "./build")));
// Step 2:
server.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./build", "index.html"));
});
server.use("/", express.static(__dirname + "converter/output"));

// express router
//start listening ti request

server.use("/", require("./routes"));

//setup listener
server.listen(port, function (error) {
  if (error) {
    console.log("Error in EXPRESS :: ", error);
    return;
  }
  console.log("Server started at port : ", port);
  return;
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
