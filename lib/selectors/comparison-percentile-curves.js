/** percentile curves for the comparison scenario */

import {createSelector} from 'reselect'
import {computePercentileCurves} from './percentile-curves'

const comparisonPercentileCurves = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.destinationGrid,
  computePercentileCurves
)

export default comparisonPercentileCurves
