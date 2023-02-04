var express = require('express');
var router = express.Router();
const fs = require('fs');

const DialogueRepository = require('../dialogueRepository');
const AppDAO = require('../dao');
const stringSimilarity = require("string-similarity")


/* GET home page. */
router.get("/", (req, res) => {
  console.log("Here2")
  res.render("index", {text: "World2"})
})

router.post("/search", (req, res) => {
  console.log(req.body.query)
  var result = get_matches(req.body.query)
  //console.log(result)
  result.then((a) => {

  res.render("index", {result: a, query: req.body.query})
})

})

const dao = new AppDAO('./database_reduced.sqlite3')
const dialogueRepo = new DialogueRepository(dao)
const similarity_thresh = 0.4


function get_matches(query) {
    let match_count = 0
    var resulting_matches = []
    const matches = dialogueRepo.getAll()
     .then((rows) => {
        rows.forEach((row) => {

            const simil = phraseSimilarity(query, row['dialogue']);
            //console.log(row['dialogue'])
            if (simil >= similarity_thresh) {
                console.log(row['dialogue'])
                console.log(simil)
                match_count += 1
                resulting_matches.push([row['dialogue'],simil, row['count']])
            }

          });
          console.log("Matches Found: " + match_count)
          return resulting_matches
      })

    return matches

}

function send_matches() {
    return resulting_matches
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


module.exports = router

module.exports = router;
