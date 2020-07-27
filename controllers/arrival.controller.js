const Model = require("../models/arrivaldeparture.model.js");

// Create and Save a new Arrival
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  console.log(req.body);

  // Create a Arrival
  const arrival = new Model.Arrival({
    date: req.body.date,
    name: req.body.name,
    geo: req.body.geo,
    email: req.body.email,
    moderated: 0,
    displayed: 0,
    story: req.body.story,
    story_mod: 0
  });
  console.log("IP for new arrival: " + req.ip);
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
exports.findModerated = (req, res) => {
  Model.Arrival.getModerated((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    else res.send(data);
  });
};

// Retrieve all Arrival stories from the database.
exports.findModeratedStory = (req, res) => {
  Model.Arrival.getModeratedStory((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    else res.send(data);
  });
};

// Retrieve all Unmoderated Arrivals from the database.
exports.findUnmoderated = (req, res) => {
  Model.Arrival.getUnmoderated((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals."
      });
    else res.send(data);
  });
};

// Retrieve all Unmoderated Arrivals Stories from the database.
exports.findUnmoderatedStory = (req, res) => {
  Model.Arrival.getUnmoderatedStory((err, data) => {
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

// Retrive Map Data
exports.findMap = (req, res) => {
  Model.Arrival.getMap((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving arrivals map."
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
    } else res.send(data);
  });
};