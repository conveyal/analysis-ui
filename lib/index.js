/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import bootstrap from './bootstrap'
import ScenarioEditor from './scenario-editor'
import store from './store'
// browserify-css packs the css using this file
import './styles.css'

bootstrap(store)

const history = syncHistoryWithStore(browserHistory, store)

// initialize the application
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={ScenarioEditor} />
    </Router>
  </Provider>,
  document.getElementById('root')
)
