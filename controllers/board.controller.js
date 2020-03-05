const Arrival = require("../models/arrival.model.js");

exports.updateBoard = (io) => {
  Arrival.newBoard((err, board, web_board) => {
    if (err) {
      console.log("An error occurred while retrieving arrivals.");
      
    } else {
        console.log(web_board);
        io.sockets.emit('new_names', web_board);
    }
  });
};