var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var prompt = Promise.promisifyAll(require("prompt"));
var Table = require('cli-table');
var colors = require('colors');
var join = Promise.join;

var wordnikStart = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=";
var wordnikEnd = "&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&sortBy=alpha&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
var thesURL = "http://words.bighugelabs.com/api/2/fe273ecc9a600b384fce1b309d444f04/";


function objectToArray(synObject){
    var synonymArray =[];
    var validator = 0;
    for(var key in synObject) {
       if (synObject[key].hasOwnProperty('syn')){
            synonymArray.push(synObject[key].syn);
            validator +=1;
        }
    }
    if (validator === 0) {
        synonymArray.push(["There are no synonyms for this word"]);
    }
    return synonymArray;
}

function getSynonyms(wordType) {
    var wordByType = "";
    return request.getAsync(wordnikStart + wordType + wordnikEnd)
    .spread(
        function(response, body) {
            var formattedBody = JSON.parse(body);
            var word1 = (formattedBody[0].word);
            var word2 = (formattedBody[1].word);
            wordByType = [word1, word2];
            return [word1, word2];
        }
    )
    .catch(
        function(error){
            console.log("Error: " + error.message);
        }
    )
    .map(
        function(array) {
            return request.getAsync(thesURL + array + "/json")
            .spread(
                function(response, body){
                    var formattedBody = (JSON.parse(body));
                    return formattedBody;
                }
            )
            .catch(
                SyntaxError, function(error){
                    return ["No synonyms for this word"];
                }
            ).catch(
                function(error){
                    console.log("there was an error: " + error);
                }
            );
        }
    ).map(
        function(synArray){
            return (objectToArray(synArray));
        }
    )
    .then(
        function(synArray){
            var tableRow  = [];
            for(var i = 0; i < wordByType.length; i++) {
                var synonyms = [];
                    for (var key in synArray[i]) {
                        if (synArray[i][key]) {
                            synonyms += ((synArray[i][key]).join("\n") + "\n");
                        }
                    }
                    tableRow[i] = [wordType.magenta, wordByType[i].rainbow, synonyms];
                }
            return tableRow;
            }
    );
}

join(getSynonyms("noun"), getSynonyms("verb"), getSynonyms("adjective"),
    function(nouns, verbs, adjectives) {
        var finalTable  = new Table({ head: ["type".cyan, "word".yellow, 'Synonyms'.red] });
        var finalData = [nouns, verbs, adjectives]; 
        for (var i = 0; i < finalData.length; i++) {
            for (var key in finalData[i]) {
                finalTable.push(finalData[i][key]);   
            }
        }
        console.log(finalTable.toString());
    }
);

