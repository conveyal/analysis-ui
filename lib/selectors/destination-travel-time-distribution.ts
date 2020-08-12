import lonlat from '@conveyal/lonlat'
import fpGet from 'lodash/fp/get'
import {createSelector} from 'reselect'

const getDestination = fpGet('analysis.destination')
const getTravelTimeSurface = fpGet('analysis.travelTimeSurface')

/**
 * Extract the distribution of travel times to a destination
 */
export default createSelector(
  getDestination,
  getTravelTimeSurface,
  createDestinationTravelTimeDistribution
)

// exported for comparisonTravelTimeDistribution selector
export function createDestinationTravelTimeDistribution(
  destination,
  travelTimeSurface
) {
  if (destination == null || travelTimeSurface == null) return null

  let {x, y} = lonlat.toPixel(destination, travelTimeSurface.zoom)
  // floor them to get top left of cell the point is a part of (TODO correct?)
  x = Math.floor(x - travelTimeSurface.west)
  y = Math.floor(y - travelTimeSurface.north)

  return [
    travelTimeSurface.get(x, y, 0),
    travelTimeSurface.get(x, y, 1),
    travelTimeSurface.get(x, y, 2),
    travelTimeSurface.get(x, y, 3),
    travelTimeSurface.get(x, y, 4)
  ]
}
