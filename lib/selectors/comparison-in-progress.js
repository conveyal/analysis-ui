// @flow
import {createSelector} from 'reselect'

/** returns whether there is currently a comparison in progress */
export default createSelector(
  state => state.analysis.comparisonProjectId,
  state => state.analysis.comparisonVariant,
  (comparisonProjectId, comparisonVariant) =>
    comparisonProjectId != null && comparisonVariant != null
)
