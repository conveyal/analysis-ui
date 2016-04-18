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
import CreateBundle from './upload-bundle'
import ImportShapefile from './import-shapefile'
import Login from './login'
import ScenarioEditor from './scenario-editor'
import SelectBundle from './choose-bundle'
import SelectProject from './select-project'
import store from './store'
// browserify-css packs the css using this file
import './styles.css'

bootstrap(store)

const history = syncHistoryWithStore(browserHistory, store)

// initialize the application
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={ScenarioEditor}>
        <Route path='/create-bundle' component={CreateBundle} />
        <Route path='/import-shapefile' component={ImportShapefile} />
        <Route path='/login' component={Login} />
        <Route path='/select-bundle' component={SelectBundle} />
        <Route path='/select-project' component={SelectProject} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
