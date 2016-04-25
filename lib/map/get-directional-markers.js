/** Get directional markers for a GeoJSON LineString */

import directionIcon from './direction-icon'
import point from 'turf-point'
import bearing from 'turf-bearing'
import distance from 'turf-distance'
import { Marker } from 'react-leaflet'
import React from 'react'

const DIRECTION_MARKER_SPACING_METERS = 1500

export default function getDirectionalMarkers ({ geometry, color = '#000', spacingMeters = DIRECTION_MARKER_SPACING_METERS, map, layerContainer }) {
  let { coordinates } = geometry
  let coord = coordinates[0]
  let startMarker = <Marker
    icon={directionIcon({ color, bearing: bearing(point(coordinates[0]), point(coordinates[1])) })}
    position={[coord[1], coord[0]]}
    map={map}
    layerContainer={layerContainer}
    />

  let markers = [startMarker]

  for (let segIdx = 1, distanceToLastMarker = 0, totalDistance = 0; segIdx < coordinates.length; segIdx++) {
    let segStart = coordinates[segIdx - 1]
    let segEnd = coordinates[segIdx]

    let distanceThisSegment = distance(point(segStart), point(segEnd), 'kilometers') * 1000

    // while not if, may need multiple markers on a single long segment
    while (distanceToLastMarker + spacingMeters < totalDistance + distanceThisSegment) {
      // total distance is at start of this segment, figure out how much of the spacing is in this segment vs. last
      let metersIntoThisSegment = distanceToLastMarker + spacingMeters - totalDistance
      let frac = metersIntoThisSegment / distanceThisSegment
      let lat = segStart[1] + (segEnd[1] - segStart[1]) * frac
      let lon = segStart[0] + (segEnd[0] - segStart[0]) * frac
      let segBearing = bearing(point(segStart), point(segEnd))

      let dirMarker = <Marker
        icon={directionIcon({ color, bearing: segBearing })}
        position={[lat, lon]}
        map={map}
        layerContainer={layerContainer}
        />

      markers.push(dirMarker)

      distanceToLastMarker += spacingMeters
    }

    totalDistance += distanceThisSegment
  }

  return markers
}
