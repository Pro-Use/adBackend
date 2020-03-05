const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
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
                // Arrival.create passed as array 
                if (Array.isArray(sql)) {
                    connection.query(sql[0], sql[1], function (error, results, fields) {
                    connection.release();
                    if (error) {
                        return callback(null, error);
                    } 
                    return callback(null, results);
                    });
                } else {
                    connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        return callback(null, error);
                    } 
                    return callback(null, results);
                    });
                }
            }
        }
    });
}
 
function query(sql, callback) { 
    console.log(callback);
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