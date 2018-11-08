// @flow
if (!window.Promise) {
  window.Promise = require('promise-polyfill')
}

const mount = require('@conveyal/woonerf/mount').default

const reducers = require('./reducers')
const Routes = require('./routes')

mount({
  app: Routes,
  reducers
})
