import {handleActions} from 'redux-actions'

import {reducer as opportunityDatasets} from './modules/opportunity-datasets'
import * as analysis from './reducers/analysis'
import * as mapState from './reducers/map-state'
import * as network from './reducers/network'
import * as project from './reducers/project'
import * as scenario from './reducers/scenario'
import * as user from './reducers/user'

export default {
  analysis: handleActions(analysis.reducers, analysis.initialState),
  mapState: handleActions(mapState.reducers, mapState.initialState),
  network: handleActions(network.reducers, network.initialState),
  opportunityDatasets,
  project: handleActions(project.reducers, project.initialState),
  scenario: handleActions(scenario.reducers, scenario.initialState),
  user: handleActions(user.reducers, user.initialState)
}
