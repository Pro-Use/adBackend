const Arrival = require("../models/arrival.model.js");
const io = require('../server').io;

exports.updateBoard = (res) => {
  return Arrival.newBoard((err, board, web_board) => {
    if (err) {
      console.log ("An error occurred while retrieving arrivals.");
    } else {
        console.log(board);
        return board;
    }
  });
};