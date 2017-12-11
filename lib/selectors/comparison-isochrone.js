// @flow
import {createSelector} from 'reselect'
import {computeSingleValuedSurface, computeIsochrone} from './isochrone'

const comparisonSingleValuedSurface = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  computeSingleValuedSurface
)

/** Selector for the comparison project isochrone */
export default createSelector(
  comparisonSingleValuedSurface,
  state => state.analysis.isochroneCutoff,
  computeIsochrone
)
