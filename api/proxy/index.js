const httpProxy = require('http-proxy')
const {timer} = require('../../lib/utils/metric')

console.log('api/proxy', process.env.API_URL)

const proxy = httpProxy.createProxyServer({
  secure: false, // TODO true in production?
  target: process.env.API_URL
})

module.exports = function(req, res) {
  proxy.web(req, res)
}
