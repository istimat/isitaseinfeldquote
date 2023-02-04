const fs = require('fs');
const { parse } = require("csv-parse");

const DialogueRepository = require('./dialogueRepository');
const AppDAO = require('./dao');



function main() {
    const dao = new AppDAO('./database_reduced.sqlite3')
    const dialogueRepo = new DialogueRepository(dao)
    i=0
    fs.createReadStream("./scripts_reduced.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async (row) => {
      //console.log("dialogue: " + row[3]);
      i++
      const count = i
      const season = row[0]
      const episode = row[1]
      const actor = row[2]
      const dialogue = row[3]
      await dialogueRepo.createTable()
      .then(() => dialogueRepo.create(count, season, episode, actor, dialogue))

    });

}

main() 