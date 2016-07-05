/** Display patterns on the map */

import Color from 'color'
import React, {PropTypes} from 'react'
import {MapComponent, GeoJson} from 'react-leaflet'

import colors from '../colors'
import DirectionIcon from './direction-icon'
import getDirectionalMarkerCoordinatesAndBearings from './get-directional-markers'

export default class PatternLayer extends MapComponent {
  static defaultProps = {
    color: colors.NEUTRAL
  }

  static propTypes = {
    activeTrips: PropTypes.array,
    color: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    dim: PropTypes.bool,
    layerContainer: PropTypes.object,
    map: PropTypes.object,
    modification: PropTypes.object.isRequired
  }

  getPatterns () {
    const {activeTrips, data, dim, modification} = this.props
    const feed = data.feeds[modification.feed]

    // data has not loaded
    if (feed === undefined) return null

    // route has not yet been chosen
    if (modification.routes == null) return null

    let patterns = feed.routes.get(modification.routes[0]).patterns

    // data has not loaded
    if (patterns === undefined) return null

    return filterPatterns({ activeTrips, dim, modification, patterns })
  }

  renderPatternGeometry ({
    color,
    patterns
  }) {
    // data not yet loaded
    if (patterns && patterns.length > 0) {
      const geometry = {
        type: 'FeatureCollection',
        features: patterns.map((pat) => {
          return {
            type: 'Feature',
            geometry: pat.geometry
          }
        })
      }

      const {map, layerContainer} = this.props

      return <GeoJson
        data={geometry}
        color={color}
        weight={3}
        map={map}
        layerContainer={layerContainer}
        />
    }
  }

  getDirectionalMarkers ({
    color,
    patterns
  }) {
    // data not yet loaded
    if (patterns === null) return []

    const {map, layerContainer} = this.props

    return [].concat(...patterns.map((pattern, i) => {
      return getDirectionalMarkerCoordinatesAndBearings({coordinates: pattern.geometry.coordinates})
        .map((m, j) => {
          return <DirectionIcon
            bearing={m.bearing}
            color={color}
            coordinates={m.coordinates}
            key={`direction-icon-${i}-${j}-${m.coordinates[0]}-${m.coordinates[1]}-${m.bearing}`}
            layerContainer={layerContainer}
            map={map}
            />
        })
    }))
  }

  render () {
    let {color, dim} = this.props
    const patterns = this.getPatterns()

    if (dim) {
      color = Color(color).alpha(0.2).hslString()
    }

    return <span>
      {this.renderPatternGeometry({color, patterns})}
      {[...this.getDirectionalMarkers({color, patterns})]}
    </span>
  }
}

function filterPatterns ({
  activeTrips,
  dim,
  modification,
  patterns
}) {
  // handle inchoate modifications that do not yet have patterns
  if (modification.trips == null && modification.entries == null) {
    return patterns // or return [] ?
  }

  // some modification types (convert-to-frequency) don't have trips/patterns specified at the modification
  // level, so .trips is undefined, not null
  if (modification.trips !== null && modification.type !== 'convert-to-frequency') {
    return patterns.filter((pat) => pat.trips.findIndex((t) => modification.trips.indexOf(t.trip_id) > -1) > -1)
  }

  if (!dim && activeTrips && activeTrips.length > 0) {
    return patterns.filter((pat) => pat.trips.findIndex((t) => activeTrips.indexOf(t.trip_id) > -1) > -1)
  }

  return filterSelectedPatterns({ modification, patterns })
}

function filterSelectedPatterns ({
  modification,
  patterns
}) {
  const selectedTrips = modification.entries.reduce((all, e) => all.concat(e.patternTrips || []), [])
  if (selectedTrips.length > 0) {
    return patterns.filter((pat) => pat.trips.findIndex((t) => selectedTrips.indexOf(t.trip_id) > -1) > -1)
  } else {
    return patterns
  }
}
