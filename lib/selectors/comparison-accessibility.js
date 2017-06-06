/** Selector for accessibility for the comparison */

import {createSelector} from 'reselect'
import {computeAccessibility} from './accessibility'

const comparisonAccessibility = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.destinationGrid,
  computeAccessibility
)

export default comparisonAccessibility
