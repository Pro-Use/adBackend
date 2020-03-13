const Model = require("../models/arrivaldeparture.model.js");
const moderate = require("../models/moderation.model.js");

// Create and Save a new Arrival
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // Moderate name
  
  moderation_res = moderate.Moderate(req.body.name);


  // Create a Arrival
  const arrival = new Model.Arrival({
    date: req.body.date,
    name: req.body.name,
    geo: req.body.geo,
    email: req.body.email,
    moderated: moderation_res,
    displayed: 0
  });

  // Save Arrival in the database
  Model.Arrival.create(arrival, (err, data) => {
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
  Model.Arrival.getAll((err, data) => {
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
  Model.Arrival.getBoard((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    else res.send(data);
  });
};

// Find a single Arrival with a arrivalId
exports.findOne = (req, res) => {
  Model.Arrival.findById(req.params.arrivalId, (err, data) => {
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

  Model.Arrival.updateById(
    req.params.arrivalId,
    new Model.Arrival(req.body),
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
  Model.Arrival.remove(req.params.arrivalId, (err, data) => {
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