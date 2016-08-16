/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory, IndexRoute, Router, Route} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Application from './application'
import {authIsRequired, bootstrap} from './auth0'
import EditBundle from './edit-bundle'
import EditProject from './edit-project'
import EditScenario from './edit-scenario'
import ImportModifications from './import-modifications'
import ImportShapefile from './import-shapefile'
import Login from './login'
import Modifications from './modifications'
import Project from './project'
import Scenario from './scenario'
import SelectProject from './select-project'
import SelectScenario from './select-scenario'
import store from './store'

if (process.env.NODE_ENV === 'development') {
  const Perf = window.Perf = require('react-addons-perf')
  Perf.start()
}

import './styles.css'

authIsRequired && bootstrap(store)

const history = syncHistoryWithStore(browserHistory, store)

// initialize the application
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Application}>
        <IndexRoute component={SelectProject} />
        <Route path='projects/:projectId' component={Project}>
          <IndexRoute component={SelectScenario} />
          <Route path='bundles/create' component={EditBundle} />
          <Route path='bundles/:bundleId/edit' component={EditBundle} />
          <Route path='edit' component={EditProject} />
          <Route path='scenarios/create' component={EditScenario} />
          <Route path='scenarios/:scenarioId' component={Scenario}>
            <IndexRoute component={Modifications} />
            <Route path='edit' component={EditScenario} />
            <Route path='import-modifications' component={ImportModifications} />
            <Route path='import-shapefile' component={ImportShapefile} />
            <Route path='modifications/:modificationId' component={Modifications} />
          </Route>
        </Route>
      </Route>
      <Route path='/login' component={Login} />
    </Router>
  </Provider>,
  document.getElementById('root')
)
