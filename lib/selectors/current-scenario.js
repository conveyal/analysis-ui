// @flow
import {createSelector} from 'reselect'

import selectCurrentScenarioId from './current-scenario-id'

export default createSelector(
  selectCurrentScenarioId,
  state => state.scenario && state.scenario.scenarios,
  (_id, scenarios = []) => scenarios.find(s => s._id === _id)
)
