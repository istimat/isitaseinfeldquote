const fs = require('fs');

const DialogueRepository = require('./dialogueRepository');
const AppDAO = require('./dao');
const stringSimilarity = require("string-similarity")

// const dialogues =

function main() {
    const dao = new AppDAO('./database.sqlite3')
    const dialogueRepo = new DialogueRepository(dao)
    const similarity_thresh = 0.6
    let match_count = 0
    var resulting_matches = []

     dialogueRepo.getAll()
     .then((rows) => {
        rows.forEach((row) => {
            
            const simil = phraseSimilarity("You're in latex", row['dialogue']);
            if (simil > similarity_thresh) {
                console.log(row['dialogue'])
                console.log(simil)
                match_count += 1
                resulting_matches.push([row['dialogue'],simil])
            }
            
        });
        console.log("Matches Found: " + match_count)

        })
    
}





function phraseSimilarity(searchphrase, data) {
    //go through data string with width of searchphrase word count and return highest similarity rating
    
    //drops commas from input string
    data = data.replace(/,/g, ' ')
    const dataArray = data.toString().split(' ')
    const searchphraseArray = searchphrase.split(" ")

    let max_simil = 0
    for (let i = 0; i < dataArray.length; i++) {

        //create the searchphrase length sub arrays of the data string
        //use stringvar.join(" ")
        //console.log(dataArray)
        if (i < dataArray.length-searchphraseArray.length) {

            const currentSlice = dataArray.slice(i, searchphraseArray.length + i )
            const current_simil = stringSimilarity.compareTwoStrings(searchphrase, currentSlice.join(" "));
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




//main func call
main()