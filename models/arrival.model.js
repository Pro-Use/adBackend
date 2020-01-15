const sql = require("./db.js");

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