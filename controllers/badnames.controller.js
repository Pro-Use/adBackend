const Model = require("../models/badnames.model.js");

// Create and Save a new Arrival
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a bad name entry
  const badname = new Model.BadName({
    name: req.body.name.toUpperCase(),
    type: req.body.type
  });

  // Save bad name in the database
  Model.BadName.create(badname, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while creating the Arrival."
      });
    else res.send(data);
  });
};

// Retrieve all bad names from the database.
exports.findBadNames = (req, res) => {
  Model.BadName.getBadNames((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    else res.send(data);
  });
};

// Delete a Arrival with the specified badNameId in the request
exports.delete = (req, res) => {
  Model.BadName.remove(req.params.badNameId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Arrival with id ${req.params.badNameId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Arrival with id " + req.params.badNameId
        });
      }
    } else res.send(data);
  });
};