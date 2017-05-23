// @flow
import isEqual from 'lodash/isEqual'
import React, {PureComponent} from 'react'
import {FeatureGroup, GeoJson, CircleMarker} from 'react-leaflet'
import uuid from 'uuid'

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
  directionalMarkerPatterns: [{
    geometry: {
      coordinates: Coordinate[]
    }
  }],
  key: string,
  geojson: FeatureCollection,
  stops: Stop[]
}

const LINE_WEIGHT = 3
const STOP_RADIUS = 2.5

/**
 * A layer to display (not edit) an added trip pattern
 */
export default class AddTripPatternLayer extends PureComponent<void, Props, State> {
  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps: Props) {
    if (!isEqual(newProps, this.props)) this.setState(getStateFromProps(newProps))
  }

  render () {
    const {directionalMarkerPatterns, geojson, key, stops} = this.state
    const {bidirectional, highlightSegment, segments} = this.props
    return <FeatureGroup>
      <GeoJson
        data={geojson}
        color={colors.ADDED}
        key={key}
        weight={LINE_WEIGHT}
        />
      {highlightSegment > -1 &&
        <GeoJson
          data={segments[highlightSegment].geometry}
          color={colors.ACTIVE}
          key={`${key}-highlight-segment`}
          weight={LINE_WEIGHT * 2}
          />}
      {!bidirectional &&
        <DirectionalMarkers
          color={colors.ADDED}
          key={`${key}-directional-markers`}
          patterns={directionalMarkerPatterns}
          />}
      <StopIcons id={`${key}-stop-icons`} stops={stops} />
    </FeatureGroup>
  }
}

function getStateFromProps (props) {
  const coordinates = getCoordinatesFromSegments(props.segments)
  return {
    directionalMarkerPatterns: [{geometry: {coordinates}}],
    geojson: getFeatureCollectionFromLineSegments(props.segments),
    key: uuid.v4(),
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
  id,
  stops
}) => <g>{stops.map((stop, idx) =>
  <CircleMarker
    center={stop.center}
    key={`${id}-${idx}`}
    color={colors.ADDED}
    radius={STOP_RADIUS}
  />)}</g>
