const fs = require('fs');

const DialogueRepository = require('./dialogueRepository');
const AppDAO = require('./dao');
const stringSimilarity = require("string-similarity")
const express = require('express')
const app = express()
const path = require('path')
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));

app.get('/search/:query?', function(req, res){
    var query = req.params.query;
    result = get_matches(query).then(function(result) {
        res.send(result)
    });
  });
  
  app.listen(port, () => {
    console.log(`+listening on port ${port}`)
  })

  app.get('/client.js', function(req, res){
    res.sendFile(path.join(__dirname, '/client.js'));
  });

const dao = new AppDAO('./database_reduced.sqlite3')
const dialogueRepo = new DialogueRepository(dao)
const similarity_thresh = 0.4


function get_matches(query) {
    let match_count = 0
    var resulting_matches = []
    return dialogueRepo.getAll()
     .then((rows) => {
        rows.forEach((row) => {

            const simil = phraseSimilarity(query, row['dialogue']);
            //console.log(row['dialogue'])
            if (simil >= similarity_thresh) {
                //console.log(row['dialogue'])
                //console.log(simil)
                match_count += 1
                resulting_matches.push([row['dialogue'],simil, row['count']])
            }

        });
        console.log("Matches Found: " + match_count)
        //console.log(resulting_matches)
        return resulting_matches
    });

}







function phraseSimilarity(searchphrase, data) {
    //go through data string with width of searchphrase word count and return highest similarity rating
    
    //drops commas from input string
    data = data.replace(/[,.?]/g, '')
    const dataArray = data.toString().split(' ')
    const searchphraseArray = searchphrase.split(" ")

    let max_simil = 0
    //console.log(data)
    for (let i = 0; i <= dataArray.length; i++) {

        //create the searchphrase length sub arrays of the data string
        //use stringvar.join(" ")
        //console.log(dataArray)
        if (i <= dataArray.length-searchphraseArray.length) {

            const currentSlice = dataArray.slice(i, searchphraseArray.length + i )
            const current_simil = stringSimilarity.compareTwoStrings(searchphrase, currentSlice.join(" "));
            //console.log(currentSlice.join(" "))
            //console.log(searchphrase)
            //console.log(current_simil)
            if (current_simil > max_simil) {
                max_simil = current_simil
            }
        }
        else { break; }   

    } 

    return max_simil
}

function rankedMatches(number_of_matches, all_matches) {
    //return first number_of_matches results in descending order of match
}

