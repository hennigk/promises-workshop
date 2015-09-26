var Promise = require("bluebird");
var colors = require('colors');
var request = Promise.promisifyAll(require("request"));
var wordnikURL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&sortBy=alpha&sortOrder=asc&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
var thesURL = "http://words.bighugelabs.com/api/2/fe273ecc9a600b384fce1b309d444f04/";
var wordListGLobal;

function requestError(response) {
    return request.statusCode !== 200;
}

function getWordList(){
    return request.getAsync(wordnikURL);
}

function objectToArray(synObject){
    var synonymArray =[];
    var validator = 0;
    for(var key in synObject) {
       if (synObject[key].hasOwnProperty('syn')){
            var holder = (synObject[key].syn);
            synonymArray += key + "s:  " + holder.join(", ") + "\n\n";
            validator +=1;
        }
    }
    if (validator === 0) {
        synonymArray.push("There are no synonyms for this word");
    }
    return synonymArray;
}



getWordList().spread(
    function(response, body){
        var wordList = JSON.parse(body);
        wordListGLobal = wordList;
        return wordList;
    }
).catch(
    requestError, function(error){
        console.log("Error1 = " + error);
    }
).map(
    function(wordListArray) {
        return request.getAsync(thesURL + wordListArray.word + "/json").spread(
            function(response, body){
                return(JSON.parse(body));
            }
        ).catch(SyntaxError, function(error){
                return("No synonyms for this word");
            }
    ).catch(
            requestError, function(error){
                console.log("Error3 = " + error);
            }
        );
    }
).map(
    function(synArray){
        return (objectToArray(synArray));
    }
).then(
    function(synonymArray){
        for(var i = 0; i < wordListGLobal.length; i++) {
            console.log("Synonyms of: ".red + wordListGLobal[i].word.magenta);
            console.log(synonymArray[i].cyan + "\n");
        }
    }
);



