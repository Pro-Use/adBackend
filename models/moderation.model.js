const melissa = require("../config/melissa.config.js");
const request = require('request');

const Moderate = (name) => {
    var q_name = name.replace(/ /g, "%20");
    var name_count = (name.match(/ /g) || []).length;
    var URL = "https://globalname.melissadata.net/V3/WEB/GlobalName/doGlobalName?";
    var query = "t=1&id=" + melissa.KEY + "&opt=''&comp=''&full=" + q_name + "&format=json";
    var errors = 0;
    var census_matches = 0;
    request.get(URL + query, (err, res, body) => {
        if(err) {
            console.log(err);
            return;
        }
        var results = JSON.parse(body);
        var codes = results["Records"][0]["Results"].split(",");
        console.log(codes);
        codes.forEach(code => {
           var prefix = code.substring(0,2);
           if (prefix === "NE") {
               errors += 1;
           } else if (prefix === "NS") {
               var success = parseInt(code.substring(2,4));
               if (5 <= success <= 8){
                   census_matches += 1;
               }
           }  
        });
    });
    if (errors > 0 || census_matches < name_count) {
        return 0;
    } else {
        return 1;
    }
};

module.exports.Moderate = Moderate;
