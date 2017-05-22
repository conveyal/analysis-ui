// @flow
import React, {PureComponent} from 'react'
import {FeatureGroup, GeoJson, CircleMarker} from 'react-leaflet'

import colors from '../../constants/colors'
import DirectionalMarkers from '../directional-markers'
import getStops from '../../utils/get-stops'

import {Coordinate, FeatureCollection, Segment, Stop} from '../../types'

type Props = {
  bidirectional: boolean,
  highlightSegment: number,
  highlightStop: number,
  segments: Segment[]
}

type State = {
  coordinates: Coordinate[],
  geojson: FeatureCollection,
  stops: Stop[]
}

/**
 * A layer to display (not edit) an added trip pattern
 */
export default class AddTripPatternLayer extends PureComponent<void, Props, State> {
  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps: Props) {
    super.componentWillReceiveProps(newProps)

    this.setState(getStateFromProps(newProps))
  }

  render () {
    const {geojson, coordinates, stops} = this.state
    const {bidirectional, highlightSegment, segments} = this.props
    return <FeatureGroup>
      <GeoJson
        data={geojson}
        color={colors.ADDED}
        weight={3}
        />
      {highlightSegment > -1 &&
        <GeoJson
          data={segments[highlightSegment].geometry}
          color={colors.ADDED}
          weight={6}
          />}
      {!bidirectional &&
        <DirectionalMarkers
          color={colors.ADDED}
          patterns={[{geometry: { coordinates }}]}
          />}
      <StopIcons stops={stops} />
    </FeatureGroup>
  }
}

function getStateFromProps (props) {
  return {
    geojson: getFeatureCollectionFromLineSegments(props.segments),
    coordinates: getCoordinatesFromSegments(props.segments),
    stops: getStops(props.segments)
  }
}

function getCoordinatesFromSegments (segments) {
  // smoosh all segments together
  const coordinates = [].concat(...segments.map(({geometry}) => geometry.coordinates.slice(0, -1)))
  // add last coordinate
  coordinates.push(segments.slice(-1)[0].geometry.coordinates.slice(-1)[0])

  return coordinates
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

const StopIcons = ({
  stops
}) => <g>{stops.map((stop, idx) =>
  <CircleMarker
    center={[stop.lon, stop.lat]}
    key={`add-trip-pattern-layer-stop-${idx}`}
    color={colors.ADDED}
    radius={2.5}
  />)}</g>
