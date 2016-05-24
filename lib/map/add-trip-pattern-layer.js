/** A layer to display (not edit) an added trip pattern */

import React, {PropTypes} from 'react'
import {FeatureGroup, GeoJson} from 'react-leaflet'
import uuid from 'uuid'

import colors from '../colors'
import DirectionIcon from './direction-icon'
import getDirectionalMarkerCoordinatesAndBearings from './get-directional-markers'

export default class AddTripPatternLayer extends FeatureGroup {
  static propTypes = {
    layerContainer: PropTypes.object,
    map: PropTypes.object,
    modification: PropTypes.object.isRequired
  }

  render () {
    return <span>
      {this.renderGeometry()}
      {[...this.renderDirectionalMarkers()]}
    </span>
  }

  renderGeometry () {
    const {layerContainer, map, modification} = this.props
    const data = {
      type: 'FeatureCollection',
      features: modification.segments.map((s) => {
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
      layerContainer={layerContainer}
      map={map}
      weight={3}
      />
  }

  renderDirectionalMarkers () {
    const {layerContainer, map, modification} = this.props
    // smoosh all segments together
    const coordinates = [].concat(...modification.segments.map((s) => s.geometry.coordinates.slice(0, -1)))
    // add last coordinate
    coordinates.push(modification.segments.slice(-1)[0].geometry.coordinates.slice(-1)[0])

    return getDirectionalMarkerCoordinatesAndBearings({coordinates})
      .map((m, i) => {
        return <DirectionIcon
          bearing={m.bearing}
          color={colors.ADDED}
          coordinates={m.coordinates}
          layerContainer={layerContainer}
          map={map}
          />
      })
  }
}
