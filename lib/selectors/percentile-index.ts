import {createSelector} from 'reselect'

import nearesPercentileIndex from './nearest-percentile-index'
import selectTravelTimePercentile from './travel-time-percentile'

export default createSelector(selectTravelTimePercentile, (ttp) =>
  nearesPercentileIndex(ttp)
)
