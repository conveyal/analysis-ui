//
import get from 'lodash/get'
import {createSelector} from 'reselect'

/** returns whether there is currently a comparison in progress */
export default createSelector(
  state => get(state, 'analysis.comparisonProjectId'),
  state => get(state, 'analysis.comparisonVariant'),
  (comparisonProjectId, comparisonVariant) =>
    comparisonProjectId != null && comparisonVariant != null
)
