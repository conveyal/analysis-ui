// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

import {TRAVEL_TIME_PERCENTILES} from '../constants'

import nearestPercentileIndex from './nearest-percentile-index'

export default createSelector(
  (state) => get(state, 'analysis.profileRequest.travelTimePercentile'),
  (p) => TRAVEL_TIME_PERCENTILES[nearestPercentileIndex(p)]
)
