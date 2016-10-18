/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory, IndexRoute, Router, Route} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Application from './containers/application'
import {authIsRequired, bootstrap} from './utils/auth0'
import EditBundle from './containers/edit-bundle'
import EditProject from './containers/edit-project'
import EditScenario from './containers/edit-scenario'
import ImportModifications from './containers/import-modifications'
import ImportShapefile from './containers/import-shapefile'
import Login from './components/login'
import Modifications from './containers/modifications'
import Project from './containers/project'
import Scenario from './containers/scenario'
import SelectProject from './containers/select-project'
import SelectScenario from './containers/select-scenario'
import SinglePointAnalysis from './containers/single-point-analysis'
import Report from './containers/report'
import store from './store'

if (process.env.NODE_ENV === 'development') {
  const Perf = window.Perf = require('react-addons-perf')
  Perf.start()
}

authIsRequired && bootstrap(store)

const history = syncHistoryWithStore(browserHistory, store)

// initialize the application
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/reports/:projectId/scenarios/:scenarioId/variants/:variantId' component={Report} />
      <Route path='/' component={Application}>
        <IndexRoute component={SelectProject} />
        {/* It is a little hacky to have a separate route just for creation here, but we need to do this here
            so that the Project component is not used and doesn't try to download the inchoate and not yet saved project from the server */}
        <Route path='projects/:projectId/create' component={EditProject} />
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
            <Route path='analysis/:variantId' component={SinglePointAnalysis} />
          </Route>
        </Route>
      </Route>
      <Route path='/login' component={Login} />
    </Router>
  </Provider>,
  document.getElementById('root')
)
