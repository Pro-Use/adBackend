const Arrival = require("../models/arrival.model.js");
const io = require('../server').io;

exports.updateBoard = (res) => {
  Arrival.newBoard((err, board, web_board) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    } else {
        console.log(web_board);
        io.sockets.emit('new_names', web_board);
        res.send(board);
    }
  });
};