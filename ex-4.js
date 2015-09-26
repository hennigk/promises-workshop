var Promise = require("bluebird");
var colors = require('colors');
var request = Promise.promisifyAll(require("request"));
var prompt = Promise.promisifyAll(require("prompt"));
var thesHttp = "http://words.bighugelabs.com/api/2/7ec1db38be2bf9e9685a75e32f94a75d/";


prompt.getAsync("word").then(function(input){
    return request.getAsync(thesHttp + input.word + "/json");
}).then(function(response){
    var body = JSON.parse(response[1]);
    if ((body.hasOwnProperty('adjective')) && (body.adjective.hasOwnProperty('syn'))) {
        console.log("\nADJECTIVES:".bold.magenta);
    for (var i = 0; i < body.adjective.syn.length; i++) {
        console.log("#" + i + " " + body.adjective.syn[i].rainbow);
        }
    }
    if ((body.hasOwnProperty('verb')) && (body.verb.hasOwnProperty('syn'))) {
        console.log("\nVERBS:".bold.cyan);
            for (var i = 0; i < body.verb.syn.length; i++) {
                console.log("#" + i + " " +  body.verb.syn[i].rainbow);
            }
        }
    if ((body.hasOwnProperty('noun')) && (body.noun.hasOwnProperty('syn'))) {
        console.log("\nNOUNS".bold.yellow);
        for (var i = 0; i < body.noun.syn.length; i++) {
            console.log("#" + i + " " + body.noun.syn[i].rainbow);
        }
    }
}).catch(
    function(error){
        console.log("Oh No! There was a " + error.name + "!");
    }
);