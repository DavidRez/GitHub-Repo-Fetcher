require('dotenv').config();

let collection;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.URI, { useNewUrlParser: true });

client.connect(err => {
  if (err) console.log('error')
  collection = client.db("test").collection('repos');
  console.log('connected');
});

let save = async (repos) => {
  // save a repo or repos to the MongoDB
  await Promise.all(repos.map(repo => {
    let newRepo = {
      repo_id: repo.id,
      repo_name: repo.name,
      user_id: repo.owner.id,
      user_login: repo.owner.login,
      html_url: repo.html_url,
      updated_at: repo.updated_at,
      forks: repo.forks
    };
    
    return new Promise((resolve,reject) => {
      collection.find({repo_id: newRepo.repo_id}).toArray((err,results)=>{
        if (err)
          console.log(err);
        else {
          //check if repo exists already
          if (results.length > 0) {
            if (results[0]['repo_id'] === newRepo.id) {
                collection.update({repo_id : newRepo.id}, {$set:{updated_at: newRepo.updated_at,forks: newRepo.forks}})
                .then((result) => resolve(result))
                .catch((error) => reject(error))
            }
          }
          else {
            console.log('trying to save')
            //add new repo to database
            collection.insertOne(newRepo,{upsert:true})
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
  collection.find().limit(25).sort({forks:-1}).toArray()
  .then(data => {
    cb(null,data);
  })
  .catch(err => {
    cb(err,null);
  });
};

module.exports.find = find;
module.exports.save = save;
