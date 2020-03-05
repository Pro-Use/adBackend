const Arrival = require("../models/arrival.model.js");
const io = require('../server').io;

exports.updateBoard = function() {
  Arrival.newBoard((err, board, web_board) => {
    if (err) {
      return "An error occurred while retrieving arrivals.";
    } else {
        console.log(web_board);
        io.sockets.emit('new_names', web_board);
        return board;
    }
  });
};