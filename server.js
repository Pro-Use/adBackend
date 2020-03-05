const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cron = require('node-cron');
const board = require("../controllers/board.controller.js");

module.exports.io = io; 

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Arrivals Departures 0.1" });
});

//secure all routes with OAuth
var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://arr-dep.eu.auth0.com/.well-known/jwks.json'
    }),
    audience: 'arrivals-departures',
    issuer: 'https://arr-dep.eu.auth0.com/',
    algorithms: ['RS256']
});

app.use(jwtCheck);

// routes
require("./routes/arrival.routes.js")(app);

// socket.io
io.on('connection', function(client) {
  console.log('a user is connected');
  
  client.on('join', function(data) {
  console.log(data);
  });
});

// Update board every minute
cron.schedule('* * * * *', () => {
  board.updateBoard();
  console.log('Board updated');
});

// set port, listen for requests
server.listen(44444, () => {
  console.log("Server is running on port 44444.");
});

