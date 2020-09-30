import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectComparisonPercentileCurves from './comparison-percentile-curves'
import selectMaxTripDurationMinutes from './max-trip-duration-minutes'
import selectPercentileIndex from './percentile-index'

/**
 * Select the total accessibility for a specific percentile and cutoff of the comparison percentile curves.
 */
export default createSelector(
  selectMaxTripDurationMinutes,
  selectComparisonPercentileCurves,
  selectPercentileIndex,
  (
    cutoffMinutes: number,
    percentileCurves: number[][],
    percentileIndex: number
  ) => get(percentileCurves, `[${percentileIndex}][${cutoffMinutes}]`)
)
