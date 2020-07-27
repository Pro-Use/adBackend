module.exports = app => {
  const arrivals = require("../controllers/arrival.controller.js");

  // Create a new Arrival
  app.post("/arrivals", arrivals.create);

  // Retrieve all Arrivals
  app.get("/arrivals", arrivals.findModerated);
  
  // Retrieve all Arrival stories
  app.get("/arrivals/stories", arrivals.findModeratedStory);

  // Retrieve all Arrivals to be moderated
  app.get("/arrivals/moderation", arrivals.findUnmoderated);
  
  // Retrieve all Arrival stories to be moderated
  app.get("/arrivals/story_mod", arrivals.findUnmoderatedStory);

  // Retrieve current Arrivals board
  app.get("/arrivals/webBoard", arrivals.findBoard);
  
  // Retrieve Arrivals Map Data
  app.get("/arrivals/map", arrivals.findMap);

  // Retrieve a single Arrival with arrivalId
  app.get("/arrivals/:arrivalId", arrivals.findOne);

  // Update a Arrival with arrivalId
  app.get("/arrivals/accept/:arrivalId", arrivals.update);

  // Delete a Arrival with arrivalId
  app.delete("/arrivals/:arrivalId", arrivals.delete);

};


