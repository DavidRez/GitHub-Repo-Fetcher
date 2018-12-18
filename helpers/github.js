const request = require('request');
const config = require('../config.js');

let getReposByUsername = (username, cb) => {
  // use the request module to request repos for a 
  // specific user from the github API
  let options = {
    url: `https://api.github.com/users/${username}/repos`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${config.TOKEN}`
    }
  };

  request(options, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      let data = JSON.parse(body);
      cb(null,data);
    }
    else {
      cb(err,null);
    }
  });
}

module.exports.getReposByUsername = getReposByUsername;