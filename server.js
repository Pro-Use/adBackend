const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const options = {
    key: fs.readFile(`/etc/letsencrypt/live/arrivalsanddepartures.net/privkey.pem`),
    cert: fs.readFile(`/etc/letsencrypt/live/arrivalsanddepartures.net/fullchain.pem`)
};

//const server = require('http').createServer(options, app);
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ipfilter = require('express-ipfilter').IpFilter;
const IpDeniedError = require('express-ipfilter').IpDeniedError;
const cron = require('node-cron');
const board = require("./controllers/board.controller.js");

const ips = ['127.0.0.1', '0.0.0.0', '::ffff:134.209.184.8', "::ffff:127.0.0.1"];

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

if (app.get('env') === 'development') {
  app.use((err, req, res, _next) => {
    console.log('Error handler', err);
    if (err instanceof IpDeniedError) {
      res.status(401);
    } else {
      res.status(err.status || 500);
    }
 
    res.status(400).send({
      message: "Unauthorised Access"
    });
  });
}

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

