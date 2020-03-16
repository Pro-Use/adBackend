module.exports = app => {
  const departures = require("../controllers/departure.controller.js");

  // Create a new Departure
  app.post("/departures", departures.create);

  // Retrieve all Departures
  app.get("/departures", departures.findModerated);

  // Retrieve all Departures
  app.get("/departures/moderation", departures.findUnmoderated);
  
  // Retrieve current Departures board
  app.get("/departures/webBoard", departures.findBoard);

  // Retrieve a single Departure with departureId
  app.get("/departures/:departureId", departures.findOne);

  // Update a Departure with departureId
  app.get("/departures/accept/:departureId", departures.update);

  // Delete a Departure with departureId
  app.delete("/departures/:departureId", departures.delete);

};


