// @flow
import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.analysis.comparisonScenarioId,
  (state) => state.scenario.scenarios,
  (comparisonScenarioId, scenarios) =>
    scenarios.find((s) => s.id === comparisonScenarioId)
)
