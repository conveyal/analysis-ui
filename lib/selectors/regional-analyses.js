// @flow
import {createSelector} from 'reselect'

export default createSelector(
  state => state.region.regionalAnalyses,
  (allAnalyses = []) =>
    allAnalyses
)
