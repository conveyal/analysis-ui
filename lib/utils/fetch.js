if (typeof window === 'undefined') {
  const https = require('https')
  const agent = new https.Agent({
    rejectUnauthorized: false
  })
  const fetch = require('node-fetch')
  module.exports = function(url, options = {}) {
    return fetch(url, {...options, agent})
  }
} else {
  if (typeof window.fetch === 'undefined') require('whatwg-fetch') // polyfills
  module.exports = window.fetch
}
