// @flow
import {createSelector} from 'reselect'
import {computeAccessibility} from './accessibility'

/** Selector for accessibility for the comparison */
export default createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.destinationGrid,
  computeAccessibility
)
