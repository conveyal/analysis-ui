const connect = require('./connect')

class DBStore {
  connect(fn) {
    connect()
      .then((client) => {
        const db = client.db(process.env.MONGODB_DB || 'analysis')
        db.collection('migrations', fn)
      })
      .catch(fn)
  }

  load(fn) {
    this.connect((err, collection) => {
      if (err) return fn(err)
      collection.find().toArray((err, data) => {
        if (!data.length) return fn(null, {})
        const store = data[0]
        // Check if does not have required properties
        if (
          !Object.prototype.hasOwnProperty.call(store, 'lastRun') ||
          !Object.prototype.hasOwnProperty.call(store, 'migrations')
        ) {
          return fn(new Error('Invalid store file'))
        }

        return fn(null, store)
      })
    })
  }

  save(set, fn) {
    this.connect((err, collection) => {
      if (err) return fn(err)
      collection
        .updateOne(
          {},
          {
            $set: {
              lastRun: set.lastRun
            },
            $push: {
              migrations: {$each: set.migrations}
            }
          },
          {
            upsert: true,
            multi: true
          }
        )
        .then(() => fn())
        .catch(fn)
    })
  }
}

module.exports = DBStore
