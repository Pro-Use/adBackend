const sql = require("./db.js");
var arrivals_board = [];
var arrivals_web_board = [];

sql.query("SELECT * FROM arrivals WHERE displayed = 1 ORDER BY ID DESC LIMIT 7", 
(err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }
    res.forEach(function(item) {
      arrivals_board.push(item);
      arrivals_web_board.push({'date': item.date, 'name': item.name});
    });
    console.log("arrivals_web_board=", arrivals_web_board);
});


// constructor
const Arrival = function(arrival) {
  this.date = arrival.date;
  this.name = arrival.name;
  this.geo = arrival.geo;
  this.email = arrival.email;
  this.moderated = arrival.moderated;
};

Arrival.create = (newArrival, result) => {
  sql.query(["INSERT INTO arrivals SET ?", newArrival], (err, res) => {
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
    result(null, arrivals_web_board);
    console.log("arrivals web board: ", arrivals_web_board);
};

Arrival.newBoard = result => {
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
//    Add the new result to existing results and remove oldest one
//    console.log("old arr: " + arrivals_board.length + ", new arr: " + arrivals_board.unshift(res[0]));
        if (arrivals_board.unshift(res[0]) > 7) {
            arrivals_board.pop();
            arrivals_web_board.pop();
        };
        
        arrivals_web_board.unshift({'date': res[0].date, 'name': res[0].name});
    }
    result(null, arrivals_board, arrivals_web_board);
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