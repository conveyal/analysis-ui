/** Display patterns on the map */

import { Path } from 'react-leaflet'
import { geoJson, featureGroup, marker } from 'leaflet'
import colors from '../colors'
import directionIcon from './direction-icon'
import point from 'turf-point'
import bearing from 'turf-bearing'
import distance from 'turf-distance'

const DIRECTION_MARKER_SPACING_METERS = 2000

export default class PatternLayer extends Path {
  static defaultProps = {
    color: colors.NEUTRAL
  }

  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = featureGroup()
  }

  getPatterns () {
    let feed = this.props.data.feeds[this.props.modification.feed]

    // data has not loaded
    if (feed === undefined) return null

    // route has not yet been chosen
    if (this.props.modification.routes == null) return null

    let patterns = feed.routes.get(this.props.modification.routes[0]).patterns

    // data has not loaded
    if (patterns === undefined) return null

    // some modification types (convert-to-frequency) don't have trips/patterns specified at the modification
    // level, so .trips is undefined, not null
    if (this.props.modification.trips !== null && this.props.modification.type !== 'convert-to-frequency') {
      patterns = patterns.filter((pat) => pat.trips.findIndex((t) => this.props.modification.trips.indexOf(t.trip_id) > -1) > -1)
    }

    return patterns
  }

  render () {
    const ret = super.render()

    this.leafletElement.clearLayers()

    const patterns = this.getPatterns()

    // data not yet loaded
    if (patterns === null) return ret

    const geometry = {
      type: 'FeatureCollection',
      features: patterns.map((pat) => {
        return {
          type: 'Feature',
          geometry: pat.geometry
        }
      })
    }

    this.leafletElement.addLayer(geoJson(geometry, {
      style: {
        color: this.props.color,
        opacity: this.props.dim ? 0.1 : 1,
        weight: 3
      }
    }))

    // add markers showing direction occasionally
    for (let pattern of patterns) {
      // put marker at start of pattern
      let { coordinates } = pattern.geometry
      let coord = coordinates[0]
      let startMarker = marker([coord[1], coord[0]], {
        icon: directionIcon({ color: this.props.color, bearing: bearing(point(coordinates[0]), point(coordinates[1])) })
      })

      this.leafletElement.addLayer(startMarker)

      for (let segIdx = 1, distanceToLastMarker = 0, totalDistance = 0; segIdx < coordinates.length; segIdx++) {
        let segStart = coordinates[segIdx - 1]
        let segEnd = coordinates[segIdx]

        let distanceThisSegment = distance(point(segStart), point(segEnd), 'kilometers') * 1000

        // while not if, may need multiple markers on a single long segment
        while (distanceToLastMarker + DIRECTION_MARKER_SPACING_METERS < totalDistance + distanceThisSegment) {
          // total distance is at start of this segment, figure out how much of the spacing is in this segment vs. last
          let metersIntoThisSegment = distanceToLastMarker + DIRECTION_MARKER_SPACING_METERS - totalDistance
          let frac = metersIntoThisSegment / distanceThisSegment
          let lat = segStart[1] + (segEnd[1] - segStart[1]) * frac
          let lon = segStart[0] + (segEnd[0] - segStart[0]) * frac
          let segBearing = bearing(point(segStart), point(segEnd))

          let dirMarker = marker([lat, lon], {
            icon: directionIcon({ color: this.props.color, bearing: segBearing })
          })

          this.leafletElement.addLayer(dirMarker)

          distanceToLastMarker += DIRECTION_MARKER_SPACING_METERS
        }

        totalDistance += distanceThisSegment
      }
    }

    return ret
  }
}
