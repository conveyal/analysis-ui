/** Selector for the comparison scenario isochrone */

import {createSelector} from 'reselect'
import {computeSingleValuedSurface, computeIsochrone} from './isochrone'

const comparisonSingleValuedSurface = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  computeSingleValuedSurface
)

const comparisonIsochrone = createSelector(
  comparisonSingleValuedSurface,
  state => state.analysis.isochroneCutoff,
  computeIsochrone
)

export default comparisonIsochrone
