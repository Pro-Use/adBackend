const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
module.exports.io = io; 

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Arrivals Departures 0.1" });
});

// routes
require("./routes/arrival.routes.js")(app);

// socket.io


// set port, listen for requests
server.listen(44444, () => {
  console.log("Server is running on port 44444.");
});

