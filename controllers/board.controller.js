const Model = require("../models/arrivaldeparture.model.js");

exports.updateArrivalsBoard = (io) => {
  Model.Arrival.newBoard((err, board, web_board) => {
    if (err) {
      console.log("An error occurred while retrieving arrivals.");
      
    } else {
        io.sockets.emit('new_arrival', web_board);
    }
  });
};

exports.updateDeparturesBoard = (io) => {
  Model.Departure.newBoard((err, board, web_board) => {
    if (err) {
      console.log("An error occurred while retrieving departures.");
      
    } else {
        io.sockets.emit('new_departure', web_board);
    }
  });
};