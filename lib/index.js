/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory, Router, Route} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Application from './application'
import bootstrap from './bootstrap'
import CreateBundle from './upload-bundle'
import ImportShapefile from './import-shapefile'
import Login from './login'
import SelectBundle from './choose-bundle'
import SelectScenario from './select-scenario'
import store from './store'

import './styles.css'

bootstrap(store)

const history = syncHistoryWithStore(browserHistory, store)

// initialize the application
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Application}>
        <Route path='/create-bundle' component={CreateBundle} />
        <Route path='/import-shapefile' component={ImportShapefile} />
        <Route path='/login' component={Login} />
        <Route path='/select-bundle' component={SelectBundle} />
        <Route path='/select-scenario' component={SelectScenario} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
