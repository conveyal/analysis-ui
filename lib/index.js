// @flow
if (!window.Promise) {
  window.Promise = require('promise-polyfill')
}

const mount = require('./mount').default
const reducers = require('./reducers')
const Routes = require('./routes')

mount({
  app: Routes,
  reducers
})
