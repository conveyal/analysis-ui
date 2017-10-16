// @flow
import {createSelector} from 'reselect'

/** returns whether there is currently a comparison in progress */
export default createSelector(
  state => state.analysis.comparisonScenarioId,
  state => state.analysis.comparisonVariant,
  (comparisonScenarioId, comparisonVariant) =>
    comparisonScenarioId != null && comparisonVariant != null
)
