import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {routerReducer as routing} from 'react-router-redux'

import * as analysis from './analysis'
import * as mapState from './map-state'
import * as network from './network'
import * as project from './project'
import * as scenario from './scenario'
import * as user from './user'

export default combineReducers({
  analysis: handleActions(analysis.reducers, analysis.initialState),
  mapState: handleActions(mapState.reducers, mapState.initialState),
  network: handleActions(network.reducers, network.initialState),
  project: handleActions(project.reducers, project.initialState),
  routing,
  scenario: handleActions(scenario.reducers, scenario.initialState),
  user: handleActions(user.reducers, user.initialState)
})
