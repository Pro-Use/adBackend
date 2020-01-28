const sql = require("./db.js");
var board_array = [];
sql.query("SELECT * FROM arrivals WHERE displayed = 1 LIMIT 7", (err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
        res.forEach(function(item) {
           board_array.push(item); 
        });
    }
});

console.log("board_array=", board_array);
// constructor
const Arrival = function(arrival) {
  this.date = arrival.date;
  this.name = arrival.name;
  this.geo = arrival.geo;
  this.email = arrival.email;
  this.moderated = arrival.moderated;
};

Arrival.create = (newArrival, result) => {
  sql.query("INSERT INTO arrivals SET ?", newArrival, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created arrival: ", { id: res.insertId, ...newArrival });
    result(null, { id: res.insertId, ...newArrival });
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

Arrival.getAll = result => {
  sql.query("SELECT * FROM arrivals", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("arrivals: ", res);
    result(null, res);
  });
};

Arrival.getBoard = result => {
//  Get oldest result not yet displayed
  sql.query("SELECT * FROM arrivals WHERE displayed = 0 LIMIT 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
//    If there is an undisplayed result, set it to dipslayed
    if (res.length === 1) {
        console.log("Displaying: ", res[0].ID);
        sql.query( "UPDATE arrivals SET displayed = 1 WHERE id = ?", [res[0].ID], 
          (err) => {
            if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
            }
        });
    }
//    Add the new result to existing results and remove oldest one
//    console.log("old arr: " + board_array.length + ", new arr: " + board_array.unshift(res[0]));
    if (board_array.unshift(res[0]) > 7) {
        board_array.pop();
    };
    result(null, board_array);
  });
};

Arrival.updateById = (id, arrival, result) => {
  sql.query(
    "UPDATE arrivals SET email = ?, name = ?, active = ? WHERE id = ?",
    [arrival.email, arrival.name, arrival.active, id],
    (err, res) => {
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

      console.log("updated arrival: ", { id: id, ...arrival });
      result(null, { id: id, ...arrival });
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


module.exports = Arrival;