const Model = require("../models/arrivaldeparture.model.js");

// Create and Save a new Departure
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // Moderate name TODO
  var moderation_res = 1;


  // Create a Departure
  const departure = new Model.Departure({
    date: req.body.date,
    name: req.body.name,
    geo: req.body.geo,
    email: req.body.email,
    moderated: moderation_res,
    displayed: 0
  });

  // Save Departure in the database
  Model.Departure.create(departure, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while creating the Departure."
      });
    else res.send(data);
  });
};

// Retrieve all Departures from the database.
exports.findAll = (req, res) => {
  Model.Departure.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving departures."
      });
    else res.send(data);
  });
};

// Retrieve current board.
exports.findBoard = (req, res) => {
  Model.Departure.getBoard((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving departures."
      });
    else res.send(data);
  });
};

// Find a single Departure with a departureId
exports.findOne = (req, res) => {
  Model.Departure.findById(req.params.departureId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Departure with id ${req.params.departureId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Departure with id " + req.params.departureId
        });
      }
    } else res.send(data);
  });
};

// Update a Departure identified by the departureId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  Model.Departure.updateById(
    req.params.departureId,
    new Model.Departure(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Departure with id ${req.params.departureId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Departure with id " + req.params.departureId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Departure with the specified departureId in the request
exports.delete = (req, res) => {
  Model.Departure.remove(req.params.departureId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Departure with id ${req.params.departureId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Departure with id " + req.params.departureId
        });
      }
    } else res.send({ message: `Departure was deleted successfully!` });
  });
};