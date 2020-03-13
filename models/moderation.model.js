const melissa = require("../config/melissa.config.js");
const nameapi = require("../config/nameapi.config.js");
const request = require('request');
var errors = 0;
var census_matches = 0;

exports.Moderate = (name, result) => {
    errors = 0;
    census_matches = 0;
    var q_name = name.replace(/ /g, "%20");
    var name_count = (name.match(/ /g) || []).length;
    var URL = "https://globalname.melissadata.net/V3/WEB/GlobalName/doGlobalName?";
    var query = "t=1&id=" + melissa.KEY + "&opt=''&comp=''&full=" + q_name + "&format=json";
//  Mellissa Moderation - 1st pass
    request.get(URL + query, (err, res, body) => {
        if(err) {
            console.log(err);
            return;
        }
        var results = JSON.parse(body);
        var codes = results["Records"][0]["Results"].split(",");
        codes.forEach(code => {
           var prefix = code.substring(0,2).replace(/ /g, "");
           console.log(code);
           if (prefix === "NE") {
               errors += 1;
           } else if (prefix === "NS") {
               var success = parseInt(code.substring(2,4));
               if (5 <= success <= 8){
                   console.log("code is "+ success + " adding to census matches");
                   census_matches += 1;
               }
           }  
        });
        console.log("total errors:" + errors);
        console.log("total census matches:" + census_matches);
        if (errors > 0 ) {
            moderated = 0;
        }else if (census_matches < name_count) {
            console.log("moderation 2nd step");
//          Name API Moderation - 2nd Pass
            var options = {
                uri: '"http://api.nameapi.org/rest/v5.3/parser/personnameparser?apiKey=" + nameapi.KEY',
                method: 'POST',
                json: {
                  "context": {"priority" : "REALTIME","properties" : [ ]},
                  "inputPerson" : {
                      "type" : "NaturalInputPerson",
                      "personName" : {
                         "nameFields" : [ {
                         "string": name
                         }] 
                      },
                      "gender" : "UNKNOWN"
                  }
                }
              };
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                  console.log(body.id); // Print the shortened url.
                } else if (error) {
                    console.log(error);
                }
              });
            moderated = 0;
        } else {
            moderated = 1;
        }
        result(moderated);
    });
};

