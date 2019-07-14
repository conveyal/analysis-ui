import {createSelector} from 'reselect'

import {TRAVEL_TIME_PERCENTILES} from '../constants'

import nearestPercentileIndex from './nearest-percentile-index'
import selectTravelTimePercentile from './travel-time-percentile'

export default createSelector(
  selectTravelTimePercentile,
  p => TRAVEL_TIME_PERCENTILES[nearestPercentileIndex(p)]
)
