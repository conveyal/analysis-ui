import bearing from '@turf/bearing'
import distance from '@turf/distance'
import {point} from '@turf/helpers'

const DIRECTION_MARKER_SPACING_METERS = 1500

/**
 * Get directional markers for a GeoJSON LineString
 */
export function getBearingAndCoordinatesAlongLine ({
  coordinates,
  spacingMeters = DIRECTION_MARKER_SPACING_METERS
}) {
  const markers = [
    {
      bearing: bearing(point(coordinates[0]), point(coordinates[1])),
      coordinates: [coordinates[0][0], coordinates[0][1]]
    }
  ]

  for (
    let segIdx = 1, distanceToLastMarker = 0, totalDistance = 0;
    segIdx < coordinates.length;
    segIdx++
  ) {
    const segStart = coordinates[segIdx - 1]
    const segEnd = coordinates[segIdx]
    const distanceThisSegment =
      distance(point(segStart), point(segEnd), 'kilometers') * 1000

    // while not if, may need multiple markers on a single long segment
    while (
      distanceToLastMarker + spacingMeters <
      totalDistance + distanceThisSegment
    ) {
      // total distance is at start of this segment, figure out how much of the spacing is in this segment vs. last
      const metersIntoThisSegment =
        distanceToLastMarker + spacingMeters - totalDistance
      const frac = metersIntoThisSegment / distanceThisSegment
      const lat = segStart[1] + (segEnd[1] - segStart[1]) * frac
      const lon = segStart[0] + (segEnd[0] - segStart[0]) * frac

      markers.push({
        bearing: bearing(point(segStart), point(segEnd)),
        coordinates: [lon, lat]
      })

      distanceToLastMarker += spacingMeters
    }
    totalDistance += distanceThisSegment
  }

  return markers
}
