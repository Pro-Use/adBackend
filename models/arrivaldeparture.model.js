const sql = require("./db.js");
const moderate = require("../models/moderation.model.js");

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
};

Arrival.create = (newArrival, result) => {
  
  function modRes(moderated) {
      newArrival.moderated = moderated;
  }
  
  moderate.Moderate(newArrival.name, modRes => {
    console.log(modRes);
    newArrival.moderated = modRes;
    sql.query(["INSERT INTO arrivals SET ?", newArrival], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("created arrival: ", { id: res.insertId, ...newArrival });
      result(null, { moderated: newArrival.moderated });
    });        
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

Arrival.getModerated = result => {
  sql.query("SELECT date, name FROM arrivals WHERE moderated = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Moderated arrivals: ", res);
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

    console.log("Unmoderated arrivals: ", res);
    result(null, res);
  });
};


Arrival.getBoard = result => {
    result(null, arrivals_web_board);
    console.log("arrivals web board: ", arrivals_web_board);
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
    }
     console.log("arrivals web board: ", arrivals_web_board);
    result(null, arrivals_board, arrivals_web_board);
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

      console.log("updated arrival: ", { id: arrivalId});
      result(null, { id: arrivalId});
    }
  );
};

Arrival.remove = (id, result) => {
  sql.query("DELETE FROM arrivals WHERE id = ?", id, (err, res) => {
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

    console.log("deleted arrival with id: ", id);
    result(null, res);
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
};

Departure.create = (newDeparture, result) => {
  sql.query(["INSERT INTO departures SET ?", newDeparture], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created departure: ", { id: res.insertId, ...newDeparture });
    result(null, { moderated: newDeparture.moderated });
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
  sql.query("SELECT date, name FROM departures WHERE moderated = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Moderated departures: ", res);
    result(null, res);
  });
};

Departure.getunModerated = result => {
  sql.query("SELECT ID, date, name FROM departures WHERE moderated = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Unmoderated departures: ", res);
    result(null, res);
  });
};

Departure.getBoard = result => {
    result(null, departures_web_board);
    console.log("departures web board: ", departures_web_board);
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
    }
    console.log("departures web board: ", departures_web_board);
    result(null, departures_board, departures_web_board);
  });
};

Departure.updateById = (id, result) => {
  sql.query(
    "UPDATE departures SET moderated = 1 WHERE id = ?",
    [id],
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

      console.log("updated departure: ", { id: id});
      result(null, { id: id});
    }
  );
};

Departure.remove = (id, result) => {
  sql.query("DELETE FROM departures WHERE id = ?", id, (err, res) => {
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

    console.log("deleted departure with id: ", id);
    result(null, res);
  });
};

// Module exports
module.exports.Arrival = Arrival;
module.exports.Departure = Departure;