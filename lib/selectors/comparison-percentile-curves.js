// @flow
import {createSelector} from 'reselect'
import {computePercentileCurves} from './percentile-curves'

/**
 * Select the percentile curves for the comparison scenario
 */
export default createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.destinationGrid,
  (travelTimeSurface, destinationGrid) =>
    (travelTimeSurface && destinationGrid
      ? computePercentileCurves({travelTimeSurface, destinationGrid})
      : null)
)
