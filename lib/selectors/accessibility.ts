import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectMaxTripDurationMinutes from './max-trip-duration-minutes'
import selectPercentileCurves from './percentile-curves'
import selectPercentileIndex from './percentile-index'

/**
 * Select the total accessibility for a specific percentile and cutoff
 */
export default createSelector<
  unknown,
  number,
  void | number[][],
  number,
  void | number
>(
  selectMaxTripDurationMinutes,
  selectPercentileCurves,
  selectPercentileIndex,
  (cutoffMinutes, percentileCurves, percentileIndex) =>
    get(percentileCurves, `[${percentileIndex}][${cutoffMinutes}]`)
)
