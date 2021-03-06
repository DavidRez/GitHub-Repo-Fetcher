require('dotenv').config();

const request = require('request');

let getReposByUsername = (username) => {
  // use the request module to request repos for a 
  // specific user from the github API
  let options = {
    url: `https://api.github.com/users/${username}/repos`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${process.env.TOKEN}`
    }
  };
  return new Promise((success, failure) => {
    request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          let data = JSON.parse(body);
          success(data);
        }
        else {
          failure(err);
        }
      });
  })
}

module.exports.getReposByUsername = getReposByUsername;