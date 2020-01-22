//
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const WebSocket = require("ws");

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

// web socket
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (webSocket) => {
    console.info("Total connected clients:", wss.clients.size);
    app.locals.clients = wss.clients;
});

// set port, listen for requests
app.listen(44444, () => {
  console.log("Server is running on port 44444.");
});

