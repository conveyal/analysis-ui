import {handleActions} from 'redux-actions'

import admin from './modules/admin/reducer'
import opportunityDatasets from './modules/opportunity-datasets/reducer'
import r5Version from './modules/r5-version/reducer'
import * as analysis from './reducers/analysis'
import * as mapState from './reducers/map-state'
import * as network from './reducers/network'
import * as region from './reducers/region'
import * as project from './reducers/project'

// Simple reducer for storing the query string
function queryString(state = {}, action) {
  if (action.type === 'set query string') {
    return action.payload
  }
  return state
}

function user(state = {}, action) {
  if (action.type === 'set user') {
    return action.payload
  }
  return state
}

export default {
  admin,
  analysis: handleActions(analysis.reducers, analysis.initialState),
  mapState: handleActions(mapState.reducers, mapState.initialState),
  network: handleActions(network.reducers, network.initialState),
  opportunityDatasets,
  queryString,
  region: handleActions(region.reducers, region.initialState),
  r5Version,
  project: handleActions(project.reducers, project.initialState),
  user
}
