const fs = require('fs');
const { parse } = require("csv-parse");

const DialogueRepository = require('./dialogueRepository');
const AppDAO = require('./dao');



function main() {
    const dao = new AppDAO('./database.sqlite3')
    const dialogueRepo = new DialogueRepository(dao)

    fs.createReadStream("./scripts.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      console.log("Season: " + row[0]);
      const season = row[0]
      const episode = row[1]
      const actor = row[2]
      const dialogue = row[3]
      dialogueRepo.createTable()
      .then(() => dialogueRepo.create(season, episode, actor, dialogue))

    })

}

main() 