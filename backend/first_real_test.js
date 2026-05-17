const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
  if (err) throw err

  db.collection('users').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })
})
