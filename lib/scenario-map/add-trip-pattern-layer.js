/** A layer to display (not edit) an added trip pattern */

import React, {PropTypes} from 'react'
import {FeatureGroup, GeoJson} from 'react-leaflet'
import uuid from 'uuid'

import colors from '../colors'
import DirectionIcon from '../components/direction-icon'
import {getBearingAndCoordinatesAlongLine} from '../utils/markers'

export default class AddTripPatternLayer extends FeatureGroup {
  static propTypes = {
    modification: PropTypes.object.isRequired
  }

  render () {
    return <span>
      {this.renderGeometry()}
      {[...this.renderDirectionalMarkers()]}
    </span>
  }

  shouldComponentUpdate (newProps, newState) {
    return newProps.modification.geometry !== this.props.modification.geometry
  }

  renderGeometry () {
    const {modification} = this.props
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
      weight={3}
      />
  }

  renderDirectionalMarkers () {
    const {modification} = this.props
    // smoosh all segments together
    const coordinates = [].concat(...modification.segments.map((s) => s.geometry.coordinates.slice(0, -1)))
    // add last coordinate
    coordinates.push(modification.segments.slice(-1)[0].geometry.coordinates.slice(-1)[0])

    return getBearingAndCoordinatesAlongLine({coordinates})
      .map((m, i) => {
        return <DirectionIcon
          bearing={m.bearing}
          color={colors.ADDED}
          coordinates={m.coordinates}
          key={`direction-icon-${i}-${m.coordinates[0]}-${m.coordinates[1]}-${m.bearing}`}
          />
      })
  }
}
