// @flow
import {createSelector} from 'reselect'

import selectCurrentScenarioId from './current-scenario-id'

export default createSelector(
  selectCurrentScenarioId,
  state => state.scenario && state.scenario.scenarios,
  (id, scenarios = []) => scenarios.find(s => s.id === id)
)
