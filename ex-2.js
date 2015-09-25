var Promise = require("bluebird");


function delay(milliseconds) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, milliseconds);
    });
}

function getFirstChar(firstChar) {
    return delay(500).then(
    function() {
        return firstChar[0];
    } );
}


function getLastChar(lastChar){
    return delay(500).then(
    function() {
        return lastChar[lastChar.length -1];
    });
}


function getFirstAndLastCharSeq(firstLastChar){
    var firstChar;
    return getFirstChar(firstLastChar).then(
    function(gotFirstChar){
        firstChar = gotFirstChar;
        return getLastChar(firstLastChar);
    }).then(
    function(lastChar){
        return firstChar + lastChar;
    });
}


function getFirstAndLastCharParallel(parallelString){
    return Promise.join(getFirstChar(parallelString), getLastChar(parallelString), 
    function(firstChar, lastChar) {
        return firstChar + lastChar;
    });
}


getLastChar("Kayla").then(
function(lastChar){
    console.log(lastChar);
    });

getFirstChar("Kayla").then(
function(firstChar){
    console.log(firstChar);
    });

getFirstAndLastCharSeq("Kayla").then(
function(firstLastChar){
    console.log(firstLastChar);
    });

getFirstAndLastCharParallel("Kayla").then(
function(firstLastChar){
    console.log(firstLastChar);
});