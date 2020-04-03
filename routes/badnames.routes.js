module.exports = app => {
  const badnames = require("../controllers/badnames.controller.js");

  // Create a new bad names
  app.post("/badnames", badnames.create);

  // Retrieve all bad namess
  app.get("/badnames", badnames.findBadNames);
  
  // Delete a bad names with badNameId
  app.delete("/badnames/:badNameId", badnames.delete);

};