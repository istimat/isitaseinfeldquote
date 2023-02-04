var express = require('express');
var router = express.Router();
const fs = require('fs');
var app = require('../app');



/* GET home page. */
router.get("/", (req, res) => {
  console.log("Here2")
  res.render("index", {text: "World2"})
})

router.post("/search", (req, res) => {
  console.log(req.body.query)
  var result = app.get_matches(req.body.query)
  //console.log(result)
  result.then((a) => {

  res.render("index", {result: a, query: req.body.query})
})

})


module.exports = router;
