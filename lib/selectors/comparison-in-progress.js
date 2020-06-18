import get from 'lodash/get'
import {createSelector} from 'reselect'

/** returns whether there is currently a comparison in progress */
export default createSelector(
  (state) => get(state, 'analysis.requestsSettings[1].projectId'),
  (comparisonProjectId) => comparisonProjectId != null
)
