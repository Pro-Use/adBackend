const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

//// Create a connection to the database
//const connection = mysql.createConnection({
//  host: dbConfig.HOST,
//  user: dbConfig.USER,
//  password: dbConfig.PASSWORD,
//  database: dbConfig.DB
//});
//
//// open the MySQL connection
//connection.connect(error => {
//  if (error) throw error;
//  console.log("Successfully connected to the database.");
//});
//
//module.exports = connection;
const pool = mysql.createPool({
            connectionLimit : 10,
            host: dbConfig.HOST,
            user: dbConfig.USER,
            password: dbConfig.PASSWORD,
            database: dbConfig.DB,
            debug    : false 
            });                    
 
function executeQuery(sql, callback) {
    pool.getConnection((err,connection) => {
        if(err) {
            return callback(err, null);
        } else {
            if(connection) {
                connection.query(sql, function (error, results, fields) {
                connection.release();
                if (error) {
                    return callback(error, null);
                } 
                return callback(null, results);
                });
            }
        }
    });
}
 
function query(sql, callback) {    
    executeQuery(sql,function(err, data) {
        if(err) {
            return callback(err);
        }       
        callback(null, data);
    });
}
 
module.exports = {
    query: query
};