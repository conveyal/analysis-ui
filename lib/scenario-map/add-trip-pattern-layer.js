/** A layer to display (not edit) an added trip pattern */

import React, {PropTypes} from 'react'
import {FeatureGroup, GeoJson, CircleMarker} from 'react-leaflet'
import {latLng} from 'leaflet'
import uuid from 'uuid'

import colors from '../utils/colors'
import DirectionIcon from '../components/direction-icon'
import {getBearingAndCoordinatesAlongLine} from '../utils/markers'
import getStops from './transit-editor/get-stops'

export default class AddTripPatternLayer extends FeatureGroup {
  static propTypes = {
    segments: PropTypes.array.isRequired
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps) {
    super.componentWillReceiveProps(newProps)

    if (newProps.segments !== this.props.segments) {
      this.setState(getStateFromProps(newProps))
    }
  }

  shouldComponentUpdate (newProps, newState) {
    return newProps.segments !== this.props.segments
  }

  render () {
    const {geojson, key, markers, stops} = this.state
    return <FeatureGroup>
      <GeoJson
        data={geojson}
        color={colors.ADDED}
        key={key}
        weight={3}
        />
      <DirectionMarkers markers={markers} />
      <StopIcons id={key} stops={stops} />
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
    markers: getDirectionalMarkerCoordinatesFromLineSegments(props.segments),
    stops: getStops(props.segments)
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

function StopIcons ({
  id,
  stops
}) {
  return <g>
    {stops.map((stop, idx) =>
      <CircleMarker
        center={latLng(stop.lat, stop.lon)}
        key={`add-trip-pattern-layer-${id}-stop-${idx}`}
        color={colors.ADDED}
        radius={2.5}
        />)}
  </g>
}
