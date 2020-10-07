import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectComparisonPercentileCurves from './comparison-percentile-curves'
import selectMaxTripDurationMinutes from './max-trip-duration-minutes'
import selectPercentileIndex from './percentile-index'

/**
 * Select the total accessibility for a specific percentile and cutoff of the comparison percentile curves.
 */
export default createSelector<
  unknown,
  number,
  void | number[][],
  number,
  void | number
>(
  selectMaxTripDurationMinutes,
  selectComparisonPercentileCurves,
  selectPercentileIndex,
  (cutoffMinutes, percentileCurves, percentileIndex) =>
    get(percentileCurves, `[${percentileIndex}][${cutoffMinutes}]`)
)
