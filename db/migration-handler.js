const connect = require('./connect')

module.exports = function(fn) {
  return function(next) {
    connect()
      .then(client =>
        Promise.resolve(fn(client.db(process.env.MONGODB_DB || 'analysis')))
          .then(() => next())
          .catch(next)
          .finally(() => client.close())
      )
      .catch(next)
  }
}
