/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import {IndexRoute, Router, Route} from 'react-router'

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
import CreateGrid from './containers/create-grid'
import Report from './containers/report'
import Regional from './containers/regional-analysis-results'
import {setStore} from './utils/authenticated-fetch'

// initialize the application
export default function Routes ({history, store}) {
  setStore(store)
  authIsRequired && bootstrap(store)
  return <Router history={history}>
    <Route path='/reports/:projectId/scenarios/:scenarioId/variants/:variantId' component={Report} />
    <Route path='/' component={Application}>
      <IndexRoute component={SelectProject} />
      <Route path='projects/create' component={EditProject} />
      <Route path='projects/:projectId' component={Project}>
        <IndexRoute component={SelectScenario} />
        <Route path='bundles/create' component={EditBundle} />
        <Route path='bundles/:bundleId/edit' component={EditBundle} />
        <Route path='grids/create' component={CreateGrid} />
        <Route path='edit' component={EditProject} />
        <Route path='scenarios/create' component={EditScenario} />
        <Route path='scenarios/:scenarioId' component={Scenario}>
          <IndexRoute component={Modifications} />
          <Route path='edit' component={EditScenario} />
          <Route path='import-modifications' component={ImportModifications} />
          <Route path='import-shapefile' component={ImportShapefile} />
          <Route path='modifications/:modificationId' component={Modifications} />
          <Route path='analysis/:variantId' component={SinglePointAnalysis} />
          {/* TODO should be nested under analysis */}
          <Route path='analysis/regional/:regionalAnalysisId' component={Regional} />
        </Route>
      </Route>
    </Route>
    <Route path='/login' component={Login} />
  </Router>
}
