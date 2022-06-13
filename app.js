const fs = require('fs');

const DialogueRepository = require('./dialogueRepository');
const AppDAO = require('./dao');



function main() {
    const dao = new AppDAO('./database.sqlite3')
    const dialogueRepo = new DialogueRepository(dao)



     dialogueRepo.getAll()
     .then((rows) => {
        rows.forEach((row) => console.log(row));
        })
    
}

main()