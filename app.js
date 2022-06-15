const fs = require('fs');

const DialogueRepository = require('./dialogueRepository');
const AppDAO = require('./dao');
const stringSimilarity = require("string-similarity")

// const dialogues =

function main() {
    const dao = new AppDAO('./database.sqlite3')
    const dialogueRepo = new DialogueRepository(dao)
    const similarity_thresh = 0.7
    let match_count = 0

     dialogueRepo.getAll()
     .then((rows) => {
        rows.forEach((row) => {
            
            const simil = phraseSimilarity("Vandelay Industries", row['dialogue']);
            if (simil > similarity_thresh) {
                console.log(row['dialogue'])
                console.log(simil)
                match_count += 1
            }
            
        });
        console.log("Matches Found: " + match_count)

        })
    
}





function phraseSimilarity(searchphrase, data) {
    //go through data string with width of searchphrase word count and return highest score
    
    //drops commas from input string
    data = data.replace(/,/g, ' ')
    const dataArray = data.toString().split(' ')
    const searchphraseArray = searchphrase.split(" ")
    let score = 0
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

function rankedMatches(number_of_matches) {
    //return first number_of_matches results in order
}




//main func call
main()