var Promise = require("bluebird")
var request = Promise.promisifyAll(require("request"))
var prompt = Promise.promisifyAll(require('prompt'));

prompt.start();

var cityLat;
var cityLong;
var city;

Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
};
    
prompt.getAsync(['location']).then(
    function(result) {
    return (result.location)
}).then(
    function(city){
    return request.getAsync("https://maps.googleapis.com/maps/api/geocode/json?address=" + city)
    }).then(function(mapBody){
        var body = JSON.parse(mapBody[1])
        cityLat = body.results[0].geometry.location.lat;
        cityLong = body.results[0].geometry.location.lng;
        city = body.results[0].formatted_address
        console.log("\n" + city + " has the following location coordinates:");
        console.log("Latitude: " + cityLat.toFixed(2));
        console.log("Longitude: " + cityLong.toFixed(2));
    }).then(function(){
        return request.getAsync("http://api.open-notify.org/iss-now.json")
    }).then(function(body){
        var bodyObject = JSON.parse(body[1]);
        var issLat = bodyObject.iss_position.latitude;
        var issLong = bodyObject.iss_position.longitude;
        console.log("\nThe ISS is in the following position:");
        console.log("Latitude: " + issLat.toFixed(2));
        console.log("Longitude: " + issLong.toFixed(2));
        return bodyObject.iss_position
    }).then(function(issPosition){
        var issLat = issPosition.latitude;
        var issLong = issPosition.longitude;
        var R = 6371000; // metres
        var φ1 = issLat.toRadians();
        var φ2 = cityLat.toRadians();
        var Δφ = (cityLat-issLat).toRadians();
        var Δλ = (cityLong-issLong).toRadians();

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; 
    }).then(function(distance){
        console.log("\nThe distance between " + city + " and the ISS is:");
        console.log(distance.toFixed(0) + " KM"); 
    })
    
    

