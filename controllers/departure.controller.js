const Model = require("../models/arrivaldeparture.model.js");
const moderate = require("../models/moderation.model.js");

// Create and Save a new Departure
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Departure
  const departure = new Model.Departure({
    date: req.body.date,
    name: req.body.name,
    geo: req.body.geo,
    email: req.body.email,
    moderated: 0,
    displayed: 0,
    story: req.body.story,
    story_mod: 0
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
exports.findModerated = (req, res) => {
  Model.Departure.getModerated((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving departures."
      });
    else res.send(data);
  });
};

// Retrieve all Departure stories from the database.
exports.findModeratedStory = (req, res) => {
  Model.Departure.getModeratedStory((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving departures."
      });
    else res.send(data);
  });
};

// Retrieve all Unmoderated Departures from the database.
exports.findUnmoderated = (req, res) => {
  Model.Departure.getUnmoderated((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving departures."
      });
    else res.send(data);
  });
};

// Retrieve all Unmoderated Departures Stories from the database.
exports.findUnmoderatedStory = (req, res) => {
  Model.Departure.getUnmoderatedStory((err, data) => {
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

exports.findMap = (req, res) => {
  Model.Departure.getMap((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals map."
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

// Update a Departure identified by the departureId in the request
exports.updateStory = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  Model.Departure.updateStoryById(
    req.params.departureId,
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
    } else res.send(data);
  });
};