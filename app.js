const fs = require('fs');

const DialogueRepository = require('./models/dialogueRepository');
const AppDAO = require('./models/dao');
const stringSimilarity = require("string-similarity")

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const bodyParser = require('body-parser')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);


app.get("/", (req, res) => {
    res.render("index", {text: "World2"})
  })
  
  app.post("/search", (req, res) => {
    console.log(req.body.query)
    var result = get_matches(req.body.query)
    //console.log(result)
    result.then((a) => {

        get_context(a.line_index, 4).then((values) => {
            
            res.render("index", {dialogue: a.dialogue,
                before: values[0],
                after: values[1],
                season: a.season,
                episode: a.episode,
                actor: a.actor,
                query: req.body.query})
            
            })
        })
  
  })
  

const dao = new AppDAO('./models/database.sqlite3')
const dialogueRepo = new DialogueRepository(dao)
const similarity_thresh = 0.4



function get_context(index, numberOfLines) {
    const before = dialogueRepo.getBefore(index, numberOfLines)
    .then((rows) => {
        var dialogue = ""
        rows.forEach((row) => {
            dialogue = dialogue + row['actor'] + ": " + row['dialogue'] + "\n"
        })
            // console.log(dialogue)
            return dialogue
    })

    const after = dialogueRepo.getAfter(index, numberOfLines)
    .then((rows) => {
        var dialogue = ""
        rows.forEach((row) => {
            dialogue = dialogue + row['actor'] + "  : " + row['dialogue'] + "\n"

        })
        // console.log(dialogue)
            return dialogue
    })

    var all_context = Promise.all([before, after])

    return all_context
}

function get_matches(query) {
    let match_count = 0
    var resulting_matches = []
    const matches = dialogueRepo.getAll()
     .then((rows) => {
        rows.forEach((row) => {

            const simil = phraseSimilarity(query, row['dialogue']);
            //console.log(row['dialogue'])
            if (simil >= similarity_thresh) {
                //console.log(row['dialogue'])
                //console.log(simil)
                match_count += 1
                resulting_matches.push({
                    dialogue: row['dialogue'],
                    season: row['season'],
                    episode: row['episode'],
                    actor: row['actor'],
                    similarity: simil, 
                    line_index: row['count']
                })
            }

          });
          //console.log(resulting_matches[1].similarity)
          
          return bestMatch(resulting_matches)
      })

    return matches

}

function bestMatch(all_matches) {
    var max_simil = 0
    var bestMatch = {} 
    for (let i = 0; i< all_matches.length; i++) {
        if (all_matches[i].similarity > max_simil) {
            max_simil = all_matches[i].similarity
            bestMatch = all_matches[i]
        }
    }
    // console.log("BEST MATCH:")
    // console.log(bestMatch)
    return bestMatch
}


function rankedMatches(number_of_matches, all_matches) {
    var rankedMatches = []
    for (let i = 0; i<= all_matches.length; i++) {

    }
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



module.exports = app;
