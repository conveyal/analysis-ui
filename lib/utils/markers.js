// @flow
import bearing from '@turf/bearing'
import distance from '@turf/distance'
import {point} from '@turf/helpers'

import type {LonLatBearing} from '../types'

const DIRECTION_MARKER_SPACING_METERS = 1500

/**
 * Get directional markers for a GeoJSON LineString
 */
export function getBearingAndCoordinatesAlongLine (
  coordinates: number[][],
  spacingMeters: number = DIRECTION_MARKER_SPACING_METERS
): LonLatBearing[] {
  const markers = [
    {
      bearing: bearing(point(coordinates[0]), point(coordinates[1])),
      lon: coordinates[0][0],
      lat: coordinates[0][1]
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
      distance(point(segStart), point(segEnd)) * 1000

    // while not if, may need multiple markers on a single long segment
    while (
      distanceToLastMarker + spacingMeters < totalDistance + distanceThisSegment
    ) {
      // total distance is at start of this segment, figure out how much of the spacing is in this segment vs. last
      const metersIntoThisSegment =
        distanceToLastMarker + spacingMeters - totalDistance
      const frac = metersIntoThisSegment / distanceThisSegment
      const lat = segStart[1] + (segEnd[1] - segStart[1]) * frac
      const lon = segStart[0] + (segEnd[0] - segStart[0]) * frac

      markers.push({
        bearing: bearing(point(segStart), point(segEnd)),
        lon,
        lat
      })

      distanceToLastMarker += spacingMeters
    }
    totalDistance += distanceThisSegment
  }

  return markers
}
