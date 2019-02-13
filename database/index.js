const mongoose = require('mongoose');
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

let save = (obj, cb) => {
  // save a repo or repos to the MongoDB
  let newRepo = new Repo({
    repo_id: obj.id,
    repo_name: obj.name,
    user_id: obj.owner.id,
    user_login: obj.owner.login,
    html_url: obj.html_url,
    updated_at: obj.updated_at,
    forks: obj.forks
  });

  db.collection('repos').find({repo_id: obj.id}).toArray((err,results)=>{
    if (err)
      console.log(err);
    else {
      //check if repo exists already
      if (results.length > 0) {
        if (results[0]['repo_id'] === obj.id) {
          db.collection('repos').update({repo_id : obj.id}, {$set:{updated_at: obj.updated_at,forks: obj.forks}});
        }
      }
      //add new repo to database
      else {
        newRepo.save({upsert:true})
        .then((data)=>{
          cb(null,data);
        })
        .catch(err => {
          cb(err,null);
        });
      }
    }
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