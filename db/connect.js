const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

module.exports = function connect() {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(process.env.MONGODB_URL, {
      useNewUrlParser: true
    })
    client.connect(err => {
      if (err) return reject(err)
      resolve(client)
    })
  })
}
