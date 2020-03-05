const Arrival = require("../models/arrival.model.js");
const io = require('../server').io;

// Create and Save a new Arrival
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // Moderate name TODO
  var moderation_res = 1;


  // Create a Arrival
  const arrival = new Arrival({
    date: req.body.date,
    name: req.body.name,
    geo: req.body.geo,
    email: req.body.email,
    moderated: moderation_res,
    displayed: 0
  });

  // Save Arrival in the database
  Arrival.create(arrival, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while creating the Arrival."
      });
    else res.send(data);
  });
};

// Retrieve all Arrivals from the database.
exports.findAll = (req, res) => {
  Arrival.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    else res.send(data);
  });
};

// Retrieve current board.
exports.findBoard = (req, res) => {
  Arrival.getBoard((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    else res.send(data);
  });
};

// Retrieve latest Arrivals from the database for the board.
//exports.updateBoard = (req, res) => {
//  Arrival.newBoard((err, board, web_board) => {
//    if (err) {
//      res.status(500).send({
//        message:
//          err.message || "An error occurred while retrieving arrivals."
//      });
//    } else {
//        io.sockets.emit('new_names', web_board);
//        res.send(board);
//    }
//  });
//};

// Find a single Arrival with a arrivalId
exports.findOne = (req, res) => {
  Arrival.findById(req.params.arrivalId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Arrival with id ${req.params.arrivalId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Arrival with id " + req.params.arrivalId
        });
      }
    } else res.send(data);
  });
};

// Update a Arrival identified by the arrivalId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  Arrival.updateById(
    req.params.arrivalId,
    new Arrival(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Arrival with id ${req.params.arrivalId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Arrival with id " + req.params.arrivalId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Arrival with the specified arrivalId in the request
exports.delete = (req, res) => {
  Arrival.remove(req.params.arrivalId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Arrival with id ${req.params.arrivalId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Arrival with id " + req.params.arrivalId
        });
      }
    } else res.send({ message: `Arrival was deleted successfully!` });
  });
};