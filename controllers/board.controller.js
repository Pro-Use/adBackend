const Arrival = require("../models/arrival.model.js");

exports.updateBoard = (req, res) => {
  Arrival.newBoard((err, board, web_board) => {
    if (err) {
      console.log("An error occurred while retrieving arrivals.");
      
    } else {
        console.log(board);
        const io = require('../server').io;
        io.sockets.emit('new_names', board);
    }
  });
};