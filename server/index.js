const express = require('express');
const bodyParser = require('body-parser');
const github = require('../helpers/github.js');
const mongo = require('../database/index.js');
let app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

//take the github username provided
//and get the repo information from the github API, then
//save the repo information in the database
app.post('/repos', function (req, res) {
  console.log('posting username');

  let username = Object.keys(req.body)[0];

  github.getReposByUsername(username, (err,data) => {
    if (err)
      res.status(400).send('saving error');
    else {
      for (let repo of data) {
        mongo.save(repo, (err,result)=>{
          if (err)
            res.status(400).send('saving error');
        });
      }
      res.status(200).send('success');
    }
  });
});

//send back top 25 repos
app.get('/repos', function (req, res) {
  mongo.find((err,results) => {
    if(err)
      console.log(err);
    else {
      res.status(200).send(results);
    }
  });
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

