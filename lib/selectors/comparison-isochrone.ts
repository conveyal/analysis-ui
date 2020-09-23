import {createSelector} from 'reselect'

import {computeSingleValuedSurface, computeIsochrone} from './isochrone'
import selectMaxTripDurationMinutes from './max-trip-duration-minutes'
import selectTravelTimePercentile from './travel-time-percentile'

const comparisonSingleValuedSurface = createSelector(
  (state) => state.analysis.comparisonTravelTimeSurface,
  selectTravelTimePercentile,
  computeSingleValuedSurface
)

/** Selector for the comparison project isochrone */
export default createSelector(
  comparisonSingleValuedSurface,
  selectMaxTripDurationMinutes,
  computeIsochrone
)
