module.exports = app => {
  const arrivals = require("../controllers/arrival.controller.js");

  // Create a new Arrival
  app.post("/arrivals", arrivals.create);

  // Retrieve all Arrivals
  app.get("/arrivals", arrivals.findAll);

  // Retrieve latest Arrivals for board
  app.get("/arrivals/board", arrivals.updateBoard);

  // Retrieve a single Arrival with arrivalId
  app.get("/arrivals/:arrivalId", arrivals.findOne);

  // Update a Arrival with arrivalId
  app.put("/arrivals/:arrivalId", arrivals.update);

  // Delete a Arrival with arrivalId
  app.delete("/arrivals/:arrivalId", arrivals.delete);

};


