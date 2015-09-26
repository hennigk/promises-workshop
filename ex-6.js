var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var prompt = Promise.promisifyAll(require("prompt"));
var Table = require('cli-table');
var colors = require('colors');
var join = Promise.join;

var wordnikStart = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech="
var wordnikEnd = "&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&sortBy=alpha&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
//var nounURL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&sortBy=alpha&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
//var verbURL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=verb&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&sortBy=alpha&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
//var adjURL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&sortBy=alpha&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
var thesURL = "http://words.bighugelabs.com/api/2/fe273ecc9a600b384fce1b309d444f04/";

//var typeArray = ["noun", "verb", "adjective"];

function objectToArray(synObject){
    var synonymArray =[];
    var validator = 0;
    for(var key in synObject) {
       if (synObject[key].hasOwnProperty('syn')){
            //var holder = (synObject[key].syn);
            //console.log(key)
            
            //synonymArray = holder.join(", ")
            synonymArray.push(key, synObject[key].syn)
            console.log(synonymArray)
            validator +=1;
        }
    }
    if (validator === 0) {
        synonymArray = ("There are no synonyms for this word");
    }
    return synonymArray;
}



function getSynonyms(wordType) {
    var wordByType = "";
    return request.getAsync(wordnikStart + wordType + wordnikEnd)
        .spread(
            function(response, body) {
                var formattedBody = JSON.parse(body)
                var word1 = (formattedBody[0].word)
                var word2 = (formattedBody[1].word)
                wordByType = [word1, word2]
                console.log(wordType)
                console.log(wordByType)
                return [word1, word2]
            }
        )
        .catch(
            function(error){
                console.log("Error: " + error.message)
            }
        )
        .then(
            function(wordArray){
                //console.log(wordArray);
                return(wordArray)
            }
        )
        .map(
            function(array) {
                //console.log(array)
                return request.getAsync(thesURL + array + "/json")
                .spread(
                    function(response, body){
                    var formattedBody = (JSON.parse(body))
                    return formattedBody
                }
            )
            .catch(
                SyntaxError, function(error){
                    return("No synonyms for this word");
                }
            ).catch(
                function(error){
                    console.log("there was an error: " + error)
                }
            )
        }
    ).then(
        function(array){
        //   console.log(wordByType)
        //   console.log(array)
            return(array)
            
        }
    ).map(
        function(synArray){
            return (objectToArray(synArray));
        }
    ).then(
        function(synArray){
            
            //for(var i = 0; i < wordByType.length; i++) {
            //     var table = new Table({
            //         head: ["word".rainbow, 'Synonyms'.magenta] });
            //     table.push(
            //         [wordByType[1].cyan, synString]
            //         );
            // console.log(table.toString());
                
            //}
            //console.log(wordByType[i])
            //console.log(synArray)
            return(synArray)
            }
        //}
    );
}




join(getSynonyms("noun"), getSynonyms("verb"), getSynonyms("adjective"),
    function(nouns, verbs, adjectives) {
        console.log("hello");
    }
);


//table type 
//type of word - word - synonyms
//wordType - wordByType[1] - 