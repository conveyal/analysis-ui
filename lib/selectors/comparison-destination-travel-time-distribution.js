// @flow
import {createSelector} from 'reselect'
import {
  createDestinationTravelTimeDistribution
} from './destination-travel-time-distribution'

/** Select the travel time distribution for the comparison scenario */
export default createSelector(
  state => state.analysis.destination,
  state => state.analysis.comparisonTravelTimeSurface,
  createDestinationTravelTimeDistribution
)
