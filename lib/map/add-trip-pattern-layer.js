/** A layer to display (not edit) an added trip pattern */

import { FeatureGroup, GeoJson } from 'react-leaflet'
import React from 'react'
import uuid from 'uuid'
import colors from '../colors'
import getDirectionalMarkers from './get-directional-markers'

export default class AddTripPatternLayer extends FeatureGroup {
  render () {
    return <span>{[this.renderGeometry(), ...this.renderDirectionalMarkers()]}</span>
  }

  renderGeometry () {
    let data = {
      type: 'FeatureCollection',
      features: this.props.modification.segments.map((s) => {
        return {
          type: 'Feature',
          properties: {},
          geometry: s.geometry
        }
      })
    }

    return <GeoJson
      data={data}
      color={colors.ADDED}
      // geojson layers don't update on props change, force replacement
      key={uuid.v4()}
      weight={3}
      map={this.props.map}
      layerContainer={this.props.layerContainer}
      />
  }

  renderDirectionalMarkers () {
    // smoosh all segments together
    let geometry = {
      type: 'LineString',
      coordinates: [].concat(...this.props.modification.segments.map((s) => s.geometry.coordinates.slice(0, -1)))
    }

    // add last coordinate
    geometry.coordinates.push(this.props.modification.segments.slice(-1)[0].geometry.coordinates.slice(-1)[0])

    let { map, layerContainer } = this.props

    return getDirectionalMarkers({ geometry, color: colors.ADDED, map, layerContainer })
  }
}
