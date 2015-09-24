
var Promise = require("bluebird");

function delay(milliseconds) {
    return new Promise(function(resolve) {
    setTimeout(function() {
        resolve();
    }, milliseconds);
})
}
    
delay(1000).then(
    function(){
        console.log("ONE")
        return delay(1000)
    })
.then(
    function(){
        console.log("TWO"); 
    return delay(1000);
    })
.then(
    function(){
        console.log("THREE"); 
    return delay(1000);
    })
.then(
    function(){
        console.log("...LIFTOFF"); 
});    