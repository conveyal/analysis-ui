// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.region.regionalAnalyses,
  (state) => get(state, 'analysis.regional.comparisonId'),
  (analyses = [], _id) => analyses.find(r => r._id === _id)
)
