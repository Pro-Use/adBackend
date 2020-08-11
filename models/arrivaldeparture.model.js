const sql = require("./db.js");
const moderate = require("../models/moderation.model.js");
const badname = require("../models/badnames.model");
const emailer = require("../emailer/emailer.js");

// Build arrival board arrays
var arrivals_board = [];
var arrivals_web_board = [];

function pad(string, len) {
    if (string.length < len) {
        string += (' '.repeat(len - string.length));    
    }
    return string;
}

sql.query("SELECT * FROM arrivals WHERE displayed = 1 AND moderated = 1 ORDER BY ID DESC LIMIT 7", 
(err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }
    res.forEach(function(item) {
      arrivals_board.push(item);
      var padded_date = pad(item.date, 8);
      var padded_name = pad(item.name, 24);
      arrivals_web_board.push({'date': padded_date, 'name': padded_name});
    });
    console.log("arrivals_web_board=", arrivals_web_board);
});

// Build departures board arrays
var departures_board = [];
var departures_web_board = [];

sql.query("SELECT * FROM departures WHERE displayed = 1 AND moderated = 1 ORDER BY ID DESC LIMIT 7", 
(err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }
    res.forEach(function(item) {
      departures_board.push(item);
      var padded_date = pad(item.date, 8);
      var padded_name = pad(item.name, 24);
      departures_web_board.push({'date': padded_date, 'name': padded_name});
    });
    console.log("departures_web_board=", departures_web_board);
});

// Arrivals constructor
const Arrival = function(arrival) {
  this.date = arrival.date;
  this.name = arrival.name;
  this.geo = arrival.geo;
  this.email = arrival.email;
  this.moderated = arrival.moderated;
  this.displayed = arrival.displayed;
  this.story = arrival.story;
  this.story_mod = arrival.story_mod;
};

Arrival.create = (newArrival, result) => {
  
  function modRes(moderated) {
      newArrival.moderated = moderated;
  }
  
  moderate.Moderate(newArrival.name, modRes => {
    console.log(modRes);
    newArrival.moderated = modRes;
    if (newArrival.moderated < 2) {
      sql.query(["INSERT INTO arrivals SET ?", newArrival], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        console.log("created arrival: ", { id: res.insertId, ...newArrival });
          if (newArrival.moderated === 1 && newArrival.email.length > 0){
            console.log("emailing: " + newArrival.email);
            emailer.emailResponse(newArrival.email, 'confirm');
          } else {
             if (newArrival.email.length > 0) {
              console.log("emailing: " + newArrival.email);
              emailer.emailResponse(newArrival.email, 'moderate');
              emailer.emailModeration(newArrival.name);
             }
          }
        result(null, { moderated: newArrival.moderated });
      });     
    } else {
        console.log(newArrival.name + " is in bad names database, rejecting");
        if (newArrival.email.length > 0) {
            console.log("emailing: " + newArrival.email);
            emailer.emailResponse(newArrival.email, 'reject');
        }
        result(null, { moderated: 1 });
    }   
  });
};

Arrival.findById = (arrivalId, result) => {
  sql.query(`SELECT * FROM arrivals WHERE id = ${arrivalId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found arrival: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Arrival with the id
    result({ kind: "not_found" }, null);
  });
};

Arrival.getModerated = (page, result) => {
  sql.query("SELECT ID, date, name, story_mod FROM arrivals WHERE moderated = 1 ORDER BY ID ASC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("Getting arrivals archive page "+ page);
    result(null, res);
  });
};

Arrival.getModeratedStory = result => {
  sql.query("SELECT ID, date, name, story FROM arrivals WHERE moderated = 1 AND story_mod = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Arrival.getUnmoderated = result => {
  sql.query("SELECT ID, date, name FROM arrivals WHERE moderated = 0", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Arrival.getUnmoderatedStory = result => {
  sql.query("SELECT ID, date, name, story FROM arrivals WHERE moderated = 1 AND story_mod = 0 AND story IS NOT NULL", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Arrival.getBoard = result => {
    result(null, arrivals_web_board);
    console.log("arrivals web board: ", arrivals_web_board);
};

Arrival.getMap = result => {
  sql.query("SELECT ID, geo, date, name, story_mod FROM arrivals WHERE moderated = 1 AND geo", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } 
    result(null, res);
  });
};

Arrival.newBoard = result => {
//  Get oldest result not yet displayed
  sql.query("SELECT * FROM arrivals WHERE displayed = 0 AND moderated = 1 LIMIT 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }
    
//    If there is an undisplayed result, set it to dipslayed
    if (res.length === 1) {
        console.log("Displaying: ", res[0].ID);
        sql.query( "UPDATE arrivals SET displayed = 1 WHERE id = " + res[0].ID, (err) => {
            if (err) {
              console.log("error: ", err);
              return;
            }
        });
//    Add the new result to existing results and remove oldest one
//    console.log("old arr: " + arrivals_board.length + ", new arr: " + arrivals_board.unshift(res[0]));
        if (arrivals_board.unshift(res[0]) > 7) {
            arrivals_board.pop();
            arrivals_web_board.pop();
        };
        var padded_date = pad(res[0].date, 8);
        var padded_name = pad(res[0].name, 24);
        arrivals_web_board.unshift({'date': padded_date, 'name': padded_name});
        if (res[0].email) {
            console.log("emailing: " + res[0].email);
            emailer.emailResponse(res[0].email, 'display');
        }
    }
    console.log("arrivals web board: ", arrivals_web_board);
    result(null, arrivals_board, arrivals_web_board);
    // If email address present send email
  });
};

Arrival.updateById = (arrivalId, result) => {
  sql.query(
    `UPDATE arrivals SET moderated = 1 WHERE id = ${arrivalId}`,(err, res) => {
      if (err) {
       console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Arrival with the id
        result({ kind: "not_found" }, null);
        return;
      }
      sql.query(`SELECT * FROM arrivals WHERE id = ${arrivalId}`, (err, res) => {
        if (res[0].email.length > 0) {
          console.log("emailing: " + res[0].email);
          emailer.emailResponse(res[0].email, 'confirm');
        }
      });

      console.log("updated arrival: ", { id: arrivalId});
      result(null, { id: arrivalId});
    }
  );
};

Arrival.updateStoryById = (arrivalId, result) => {
  sql.query(
    `UPDATE arrivals SET story_mod = 1 WHERE id = ${arrivalId}`,(err, res) => {
      if (err) {
       console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Arrival with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated arrival story: ", { id: arrivalId});
      result(null, { id: arrivalId});
    }
  );
};

Arrival.removeStory = (arrivalId, result) => {
  sql.query(
    `UPDATE arrivals SET story = NULL WHERE id = ${arrivalId}`,(err, res) => {
      if (err) {
       console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Arrival with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted arrival story: ", { id: arrivalId});
      result(null, { id: arrivalId});
    }
  );
};

Arrival.remove = (arrivalId, result) => {
  sql.query(`SELECT * FROM arrivals WHERE id = ${arrivalId}`, (err, res) => {
    if (res.length === 0) {
        console.log("No arrival matching ID:" + arrivalId);
        result({ kind: "not_found" }, null);
        return;
    }
    if (res[0].email.length > 0 && res[0].moderated === 0) {
        console.log("emailing: " + res[0].email);
        emailer.emailResponse(res[0].email, 'reject');
    }
    badname.BadName.create({name:res[0].name.toUpperCase(), type:'arrival'}, null);
    sql.query(`DELETE FROM arrivals WHERE id = ${arrivalId}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows === 0) {
          // not found Arrival with the id
          result({ kind: "not_found" }, null);
          return;
        }
        arrivals_board.forEach((entry) => {
           if (entry.ID === parseInt(arrivalId)) {
            sql.query("SELECT * FROM arrivals WHERE displayed = 1 AND moderated = 1 ORDER BY ID DESC LIMIT 7", 
                (err, res) => {
                    if (err) {
                      console.log("error: ", err);
                      return;
                    }
                    var new_arrivals_web_board = [];
                    res.forEach(function(item) {
                      arrivals_board.push(item);
                      var padded_date = pad(item.date, 8);
                      var padded_name = pad(item.name, 24);
                      new_arrivals_web_board.push({'date': padded_date, 'name': padded_name});
                    });
                    arrivals_web_board = new_arrivals_web_board;
                    console.log("UPDATED arrivals_web_board=", arrivals_web_board);
            });
           } 
        });
        console.log("deleted arrival with id: ", arrivalId);
        result(null, { id: arrivalId});
      });
  });
};

// Departures constructor
const Departure = function(departure) {
  this.date = departure.date;
  this.name = departure.name;
  this.geo = departure.geo;
  this.email = departure.email;
  this.moderated = departure.moderated;
  this.displayed = departure.displayed;
  this.story = departure.story;
  this.story_mod = departure.story_mod;
};



Departure.create = (newDeparture, result) => {
    
  function modRes(moderated) {
      newDeparture.moderated = moderated;
  }
  
  moderate.Moderate(newDeparture.name, modRes => {
    console.log(modRes);
    newDeparture.moderated = modRes;
    sql.query(["INSERT INTO departures SET ?", newDeparture], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("created departure: ", { id: res.insertId, ...newDeparture });
      if (newDeparture.email.length > 0) {
          console.log("emailing: " + newDeparture.email);
          if (newDeparture.moderated === 1){
            emailer.emailResponse(newDeparture.email, 'confirm');
          } else {
              emailer.emailResponse(newDeparture.email, 'moderate');
          }
      }
      result(null, { moderated: newDeparture.moderated });
    });
  });
};

Departure.findById = (departureId, result) => {
  sql.query(`SELECT * FROM departures WHERE id = ${departureId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found departure: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Departure with the id
    result({ kind: "not_found" }, null);
  });
};

Departure.getModerated = result => {
  sql.query("SELECT ID, date, name, story_mod FROM departures WHERE moderated = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Departure.getModeratedStory = result => {
  sql.query("SELECT ID, date, name, story FROM departures WHERE moderated = 1 AND story_mod = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Departure.getUnmoderated = result => {
  sql.query("SELECT ID, date, name FROM departures WHERE moderated = 0", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Departure.getUnmoderatedStory = result => {
  sql.query("SELECT ID, date, name, story FROM departures WHERE moderated = 1 AND story_mod = 0 AND story IS NOT NULL", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Departure.getBoard = result => {
    result(null, departures_web_board);
    console.log("departures web board: ", departures_web_board);
};

Departure.getMap = result => {
  sql.query("SELECT ID, geo, date, name, story_mod FROM departures WHERE moderated = 1 AND geo", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } 
    result(null, res);
  });
};

Departure.newBoard = result => {
//  Get oldest result not yet displayed
  sql.query("SELECT * FROM departures WHERE displayed = 0 AND moderated = 1 LIMIT 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }
    
//    If there is an undisplayed result, set it to dipslayed
    if (res.length === 1) {
        console.log("Displaying: ", res[0].ID);
        sql.query( "UPDATE departures SET displayed = 1 WHERE id = " + res[0].ID, (err) => {
            if (err) {
              console.log("error: ", err);
              return;
            }
        });
//    Add the new result to existing results and remove oldest one
//    console.log("old arr: " + departures_board.length + ", new arr: " + departures_board.unshift(res[0]));
        if (departures_board.unshift(res[0]) > 7) {
            departures_board.pop();
            departures_web_board.pop();
        };
        var padded_date = pad(res[0].date, 8);
        var padded_name = pad(res[0].name, 24);
        departures_web_board.unshift({'date': padded_date, 'name': padded_name});
        if (res[0].email) {
            console.log("emailing: " + res[0].email);
            emailer.emailResponse(res[0].email, 'display');
        }
    }
    console.log("departures web board: ", departures_web_board);
    result(null, departures_board, departures_web_board);
  });
};

Departure.updateById = (departureId, result) => {
  sql.query(
    `UPDATE departures SET moderated = 1 WHERE id = ${departureId}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Departure with the id
        result({ kind: "not_found" }, null);
        return;
      }
      sql.query(`SELECT * FROM departures WHERE id = ${departureId}`, (err, res) => {
        if (res[0].email.length > 0) {
          console.log("emailing: " + res[0].email);
          emailer.emailResponse(res[0].email, 'confirm');
        }
      });

      console.log("updated departure: ", { id: departureId});
      
      result(null, { id: departureId});
    }
  );
};

Departure.updateStoryById = (departureId, result) => {
  sql.query(
    `UPDATE departures SET story_mod = 1 WHERE id = ${departureId}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Departure with the id
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("accepted departure story: ", { id: departureId});
      
      result(null, { id: departureId});
    }
  );
};

Departure.removeStory = (departureId, result) => {
  sql.query(
    `UPDATE departures SET story = Null WHERE id = ${departureId}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Departure with the id
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Deleted departure story: ", { id: departureId});
      
      result(null, { id: departureId});
    }
  );
};

Departure.remove = (departureId, result) => {
  sql.query(`SELECT * FROM departures WHERE id = ${departureId}`, (err, res) => {
    if (res[0].email.length > 0 && res[0].moderated === 0) {
        console.log("emailing: " + res[0].email);
        emailer.emailResponse(res[0].email, 'reject');
    }
    badname.BadName.create({name:res[0].name.toUpperCase(), type:'departure'}, null);
    sql.query(`DELETE FROM departures WHERE id = ${departureId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Departure with the id
        console.log(departureId + " not found" );
        result({ kind: "not_found" }, null);
        return;
      }
      departures_board.forEach(function(entry) {
         if (entry.ID === parseInt(departureId)) {
              sql.query("SELECT * FROM departures WHERE displayed = 1 AND moderated = 1 ORDER BY ID DESC LIMIT 7", 
              (err, res) => {
                  if (err) {
                    console.log("error: ", err);
                    return;
                  }
                  var new_departures_web_board = [];
                  res.forEach(function(item) {
                    departures_board.push(item);
                    var padded_date = pad(item.date, 8);
                    var padded_name = pad(item.name, 24);
                    new_departures_web_board.push({'date': padded_date, 'name': padded_name});
                  });
                  departures_web_board = new_departures_web_board;
                  console.log("UPDATED departures_web_board=", departures_web_board);
              });
          }
      });

      console.log("deleted departure with id: ", departureId);
      result(null, { id: departureId});
    });
  });
};

// Module exports
module.exports.Arrival = Arrival;
module.exports.Departure = Departure;