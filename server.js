const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const ipfilter = require('express-ipfilter').IpFilter;
const cron = require('node-cron');
const board = require("./controllers/board.controller.js");

const ips = ['127.0.0.1', '0.0.0.0', '::ffff:134.209.184.8'];

module.exports.io = io; 

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Arrivals Departures 0.1" });
});

// filter IP
app.use(ipfilter(ips, { mode: 'allow' }));

// routes
require("./routes/arrival.routes.js")(app);
require("./routes/departure.routes.js")(app);
require("./routes/badnames.routes.js")(app);

// socket.io
io.on('connection', function(client) {
  console.log('a user is connected');
  
  client.on('join', function(data) {
  console.log(data);
  });
});

// Update board every minute
cron.schedule('* * * * *', () => {
  board.updateArrivalsBoard(io);
  board.updateDeparturesBoard(io);
  console.log('Boards updated');
});

// set port, listen for requests
server.listen(44444, () => {
  console.log("Server is running on port 44444.");
});

