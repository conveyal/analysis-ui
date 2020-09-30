import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectMaxTripDurationMinutes from './max-trip-duration-minutes'
import selectPercentileCurves from './percentile-curves'
import selectPercentileIndex from './percentile-index'

/**
 * Select the total accessibility for a specific percentile and cutoff
 */
export default createSelector(
  selectMaxTripDurationMinutes,
  selectPercentileCurves,
  selectPercentileIndex,
  (
    cutoffMinutes: number,
    percentileCurves: number[][],
    percentileIndex: number
  ) => get(percentileCurves, `[${percentileIndex}][${cutoffMinutes}]`)
)
