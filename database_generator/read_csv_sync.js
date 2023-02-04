const fs = require('fs');
const { parse } = require("csv-parse");

const DialogueRepository = require('../dialogueRepository');
const AppDAO = require('../dao');



function main() {
    const dao = new AppDAO('./database.sqlite3')
    const dialogueRepo = new DialogueRepository(dao)


    dialogueRepo.createTable()
    fs.readFile("./scripts.csv", function (err, fileData) {
      parse(fileData, {delimiter: ",", from_line: 2}, function(err, rows) {
       for (i in rows){
        const index = i++
        const season = rows[i][0]
        const episode = rows[i][1]
        const actor = rows[i][2]
        const dialogue = rows[i][3]
        console.log(index)
        dialogueRepo.create(index, season, episode, actor, dialogue)
        console.log("created!")
       }
      })
    })




}

main() 