const connect = require('./connect')

module.exports = function(fn) {
  return function(next) {
    connect()
      .then(client =>
        fn(client.db())
          .then(() => next())
          .catch(next)
          .finally(() => client.close())
      )
      .catch(next)
  }
}
