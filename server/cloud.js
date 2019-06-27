const express = require('express');
const bodyParser = require('body-parser');
const github = require('../helpers/github.js');
const mongo = require('../database/cloud.js');
let app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

//take the github username provided
//and get the repo information from the github API, then
//save the repo information in the database
app.post('/repos', async (req, res) => {
  console.log('posting username');

  let username = Object.keys(req.body)[0];

  const repos = await github.getReposByUsername(username)
  .then(data => {
    return data;
  })
  .catch(() => {
    return []
  });

  if (repos.length > 1) {
    mongo.save(repos)
    .then(() => {
      console.log('server:repos saved')
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(400);
    });
  }
});

//send back top 25 repos
app.get('/repos',  (req, res) => {
  mongo.find((err,results) => {
    if(err)
      console.log(err);
    else {
      res.status(200).send(results);
    }
  });
});

let port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
