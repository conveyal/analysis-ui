const ifetch = require('isomorphic-fetch')

module.exports = global.fetch = (url, opts) =>
  url[0] === '/' ? ifetch(`http://mockhost.com${url}`, opts) : ifetch(url, opts)
