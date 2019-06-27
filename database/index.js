const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/repos', {useMongoClient: true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', cb => {
  console.log('connection success');
})

let repoSchema = mongoose.Schema({
  user_id: Number,
  user_login: String,
  repo_id: Number,
  repo_name: String,
  html_url: String,
  updated_at: String,
  forks: Number
});

let Repo = mongoose.model('Repo', repoSchema);

let save = async (repos) => {
  // save repos to the MongoD
  await Promise.all(repos.map(async obj => {
    let newRepo = new Repo({
      repo_id: obj.id,
      repo_name: obj.name,
      user_id: obj.owner.id,
      user_login: obj.owner.login,
      html_url: obj.html_url,
      updated_at: obj.updated_at,
      forks: obj.forks
    });

    return new Promise((resolve,reject) => {
      db.collection('repos').find({repo_id: obj.id}).toArray((err,results)=>{
        if (err)
          reject(err);
        else {
          //check if repo exists already
          if (results.length > 0) {
            if (results[0]['repo_id'] === obj.id) {
              console.log('updating repo')
              db.collection('repos').update({repo_id : obj.id}, {$set:{updated_at: obj.updated_at,forks: obj.forks}})
              .then((result) => resolve(result))
              .catch((error) => reject(error))
            }
          }
          //add new repo to database
          else {
            console.log('saving new repo')
            newRepo.save({upsert:true})
            .then((result) => resolve(result))
            .catch((error) => reject(error))
          }
        }
      });
    });
  }))
  .then(() => {
    console.log('db:all repos saved')
  })
  .catch((err) => {
    return err;
  });
}

let find = (cb) => {
  //pull the top 25 repos from database  based on the amount of forks
  db.collection('repos').find().limit(25).sort({forks:-1}).toArray((err,results) => {
    if(err)
      cb(err,null);
    else{
      cb(null,results);
    }
  });
}

module.exports.find = find;
module.exports.save = save;
