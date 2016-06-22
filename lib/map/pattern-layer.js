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
    color: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    dim: PropTypes.bool,
    layerContainer: PropTypes.object,
    map: PropTypes.object,
    modification: PropTypes.object.isRequired
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

  renderPatternGeometry ({
    color
  }) {
    const patterns = this.getPatterns()

    // data not yet loaded
    if (patterns === null) return []

    const geometry = {
      type: 'FeatureCollection',
      features: patterns.map((pat) => {
        return {
          type: 'Feature',
          geometry: pat.geometry
        }
      })
    }

    console.log(patterns)

    const {map, layerContainer} = this.props

    return <GeoJson
      data={geometry}
      color={color}
      weight={3}
      map={map}
      layerContainer={layerContainer}
      />
  }

  getDirectionalMarkers ({
    color
  }) {
    const patterns = this.getPatterns()

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

    if (dim) {
      color = Color(color).alpha(0.2).hslString()
    }

    return <span>
      {this.renderPatternGeometry({color})}
      {[...this.getDirectionalMarkers({color})]}
    </span>
  }
}
