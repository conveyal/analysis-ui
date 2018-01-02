// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

import {computeSingleValuedSurface, computeIsochrone} from './isochrone'
import selectMaxTripDurationMinutes from './max-trip-duration-minutes'

const comparisonSingleValuedSurface = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => get(state, 'analysis.profileRequest.travelTimePercentile', 50),
  computeSingleValuedSurface
)

/** Selector for the comparison project isochrone */
export default createSelector(
  comparisonSingleValuedSurface,
  selectMaxTripDurationMinutes,
  computeIsochrone
)
