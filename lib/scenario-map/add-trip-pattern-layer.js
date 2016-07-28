/** A layer to display (not edit) an added trip pattern */

import React, {Component, PropTypes} from 'react'
import {FeatureGroup, GeoJson} from 'react-leaflet'
import uuid from 'uuid'

import colors from '../colors'
import DirectionIcon from '../components/direction-icon'
import {getBearingAndCoordinatesAlongLine} from '../utils/markers'

export default class AddTripPatternLayer extends Component {
  static propTypes = {
    segments: PropTypes.array.isRequired
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps) {
    if (newProps.segments !== this.props.segments) {
      this.setState(getStateFromProps(newProps))
    }
  }

  shouldComponentUpdate (newProps, newState) {
    return newProps.segments !== this.props.segments
  }

  render () {
    const {geojson, key, markers} = this.state
    return <FeatureGroup>
      <GeoJson
        data={geojson}
        color={colors.ADDED}
        key={key}
        weight={3}
        />
      <DirectionMarkers markers={markers} />
    </FeatureGroup>
  }
}

function DirectionMarkers ({markers}) {
  return <FeatureGroup>{markers.map((marker, index) => {
    return <DirectionIcon
      bearing={marker.bearing}
      color={colors.ADDED}
      coordinates={marker.coordinates}
      key={`direction-icon-${index}-${marker.coordinates[0]}-${marker.coordinates[1]}-${marker.bearing}`}
      />
  })}
  </FeatureGroup>
}

function getStateFromProps (props) {
  return {
    key: uuid.v4(),
    geojson: getFeatureCollectionFromLineSegments(props.segments),
    markers: getDirectionalMarkerCoordinatesFromLineSegments(props.segments)
  }
}

function getDirectionalMarkerCoordinatesFromLineSegments (segments) {
  // smoosh all segments together
  const coordinates = [].concat(...segments.map(({geometry}) => geometry.coordinates.slice(0, -1)))
  // add last coordinate
  coordinates.push(segments.slice(-1)[0].geometry.coordinates.slice(-1)[0])

  return getBearingAndCoordinatesAlongLine({coordinates})
}

function getFeatureCollectionFromLineSegments (segments) {
  return {
    type: 'FeatureCollection',
    features: segments.map(({geometry}) => {
      return {
        type: 'Feature',
        properties: {},
        geometry
      }
    })
  }
}
