import {handleActions} from 'redux-actions'

import {reducer as opportunityDatasets} from './modules/opportunity-datasets'
import {reducer as r5Version} from './modules/r5-version'
import * as analysis from './reducers/analysis'
import * as mapState from './reducers/map-state'
import * as network from './reducers/network'
import * as region from './reducers/region'
import * as scenario from './reducers/scenario'
import * as user from './reducers/user'

export default {
  analysis: handleActions(analysis.reducers, analysis.initialState),
  mapState: handleActions(mapState.reducers, mapState.initialState),
  network: handleActions(network.reducers, network.initialState),
  opportunityDatasets,
  region: handleActions(region.reducers, region.initialState),
  r5Version,
  scenario: handleActions(scenario.reducers, scenario.initialState),
  user: handleActions(user.reducers, user.initialState)
}
