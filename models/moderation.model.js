const melissa = require("../config/melissa.config.js");
const request = require('request');

export const moderate = (name) => {
    var q_name = name.replace(/ /g, "%20");
    var URL = "https://globalname.melissadata.net/V3/WEB/GlobalName/doGlobalName?";
    var query = "t=1&id=" + melissa.KEY + "&opt=''&comp=''&full=" + q_name + "&format=json";
    request.get(URL + query, (err, res, body) => {
        if(err) {
            console.log(err);
            return;
        }
        var results = JSON.parse(body);
        var codes = results["Records"][0]["Results"].split(",");
        console.log(codes);
        
    });
    
};



