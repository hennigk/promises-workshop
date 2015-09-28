var Promise = require("bluebird");
var Table = require('cli-table');
var request = Promise.promisifyAll(require("request"));
var prompt = Promise.promisifyAll(require("prompt"));
var emoji = require('node-emoji');

var forecastKey = "https://api.forecast.io/forecast/d08be02eb8dd0c8d8985013914ef10df/";
var mapUrlStart = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var mapUrlEnd = "&key=AIzaSyCyJgwsFhRRPWDik2jba7YRWU45soLDtwY";

function getCity(){
    return prompt.getAsync("city");
}

getCity()
    .then(
        function(location){
            return request.getAsync(mapUrlStart + location.city + mapUrlEnd);    
        }
    ).spread(
        function(response, body){
            return JSON.parse(body);
        }
    // ).catch(
    //     TypeError, function(error){
    //         console.log(error)
    //         console.log("No location found for your input " + error.name);
    //     }
    ).catch(
        function(error){
            console.log("Error: " + error);
        }
    ).then(
        function(response){
            return response.results[0].geometry.location;
        }
    ).then(
        function(location) {
            var lat = location.lat.toFixed(2);
            var long = location.lng.toFixed(2);
            return request.getAsync(forecastKey + lat + "," + long);
        }
    ).spread(
        function(response,body){
            return(JSON.parse(body));
        }
    ).catch(
        TypeError, function(error){
            console.log(error)
            console.log("No weather found for your input " + error.name);
        }
    ).catch(
        function(error){
            console.log(error)
            console.log("Error: " + error);
        }
    ).then(
        function(forecast){
            return getDailyWeather(forecast);
        }
    ).then(
        function(weatherArray){
            var table  = new Table({ head: ["Date".cyan, "Weather".magenta] });
            for (var i = 0; i < weatherArray.length; i++) {
                table.push(weatherArray[i]);   
            }
            console.log(table.toString());
        }
    );


function getDailyWeather(forecast){
    var forecastArray = [];
    for (var i = 0; i<8; i++){
        var daily = forecast.daily.data[i]; 
        var time = getDate(daily.time);
        var sum = daily.summary.replace("and", "\nand");
        var icon = getEmoji(daily.icon);
        var tMax = ((daily.temperatureMax -  32) *  5/9).toFixed(1) + "\u2103";
        var tMin = ((daily.temperatureMin -  32) *  5/9).toFixed(1) + "\u2103";
        var weather = sum.replace(", ", "\n") + "\n\n" + "High: " + tMax + "\nLow: " + tMin + "   " + icon;
        
        forecastArray.push([time, weather]);
    }
    return(forecastArray);
}

function getDate(unixTime){
    var newDate = new Date (unixTime *1000); 
    var localDate = (newDate.toLocaleDateString());
    return localDate.replace(", ", "\n");
}

function getEmoji(icon){
    switch (icon) {
        case 'clear-day':
            return emoji.get("sun_with_face");
        case 'clear-night':
           return emoji.get("full_moon_with_face");
        case 'rain':
            return emoji.get("droplet");
        case 'snow':
            return emoji.get("snowman");
        case 'sleet':
            var sleet = emoji.get("snowman") + emoji.get("droplet");
            return sleet;
        case 'wind':
            return emoji.get("cyclone");
        case 'fog':
            return emoji.get("foggy");
        case 'cloudy':
            return emoji.get("foggy");
        case 'partly-cloudy-day':
            return emoji.get("partly_sunny");
        case 'partly-cloudy-night':
            return emoji.get("night_with_stars");
        default:
            return emoji.get("dog");
    }    
}
 
