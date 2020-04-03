const sql = require("./db.js");

const BadName = function(badname) {
    this.name = badname.name.toUpperCase();
    this.type = badname.type;
};

BadName.create = (newBadName, result) => {
    sql.query(["INSERT INTO names SET ?", newBadName], (err, res) => {
        if (err) {
          console.log("error: ", err);
          if (result) {
            result(null, err);
          }
          return;
        }
        console.log('Added bad name to database', { id: res.insertId});
        if (result) {
            result(null, {name: newBadName.name});
        }
    });
};

BadName.getBadNames = result => {
    sql.query("SELECT * FROM names ORDER BY type, name", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        result(null, res);
    });
};

BadName.removeBadName = (badNameID, result) => {
    sql.query(`DELETE FROM names WHERE id = ${badNameID}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log('Removed bad name from database', { id: badNameID});
        result(null, { id: badNameID});
    });
};

module.exports.BadName = BadName;