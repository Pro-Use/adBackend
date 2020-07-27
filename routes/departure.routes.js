module.exports = app => {
  const departures = require("../controllers/departure.controller.js");

  // Create a new Departure
  app.post("/departures", departures.create);

  // Retrieve all Departures
  app.get("/departures", departures.findModerated);
  
  // Retrieve all Departure stories
  app.get("/departures/stories", departures.findModeratedStory);

  // Retrieve all Departures to be moderated
  app.get("/departures/moderation", departures.findUnmoderated);
  
  // Retrieve all Departure stories to be moderated
  app.get("/departures/story_mod", departures.findUnmoderatedStory);
  
  // Retrieve current Departures board
  app.get("/departures/webBoard", departures.findBoard);
  
  // Retrieve Departures Map Data
  app.get("/departures/map", departures.findMap);

  // Retrieve a single Departure with departureId
  app.get("/departures/:departureId", departures.findOne);

  // Update a Departure with departureId
  app.get("/departures/accept/:departureId", departures.update);
  
  // Update a Departure with departureId
  app.get("/departures/accept_story/:departureId", departures.updateStory);

  // Delete a Departure with departureId
  app.delete("/departures/:departureId", departures.delete);

};


