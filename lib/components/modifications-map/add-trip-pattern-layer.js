// @flow
import lonlat from '@conveyal/lonlat'
import memoize from 'memoize-one'
import React from 'react'
import {Marker, Polyline, withLeaflet} from 'react-leaflet'

import {NEW_LINE_WEIGHT} from '../../constants'
import colors from '../../constants/colors'
import {
  getNewStopIconForZoom,
  getSnappedStopIconForZoom,
  enlargeIconBy
} from '../map/circle-icons'
import DirectionalMarkers from '../directional-markers'
import getStops from '../../utils/get-stops'
import type {FeatureCollection, Segment, Stop} from '../../types'

function getCoordinatesFromSegments (segments) {
  // smoosh all segments together
  const coordinates = [].concat(
    ...segments.map(({geometry}) => geometry.coordinates.slice(0, -1))
  )
  // add last coordinate
  coordinates.push(segments.slice(-1)[0].geometry.coordinates.slice(-1)[0])

  return coordinates
}

const memoizedGetStops = memoize(getStops)
const memoizedGetCoordinatesFromSegments = memoize(getCoordinatesFromSegments)
const coordinatesToLeaflet = memoize(coordinates => coordinates.map(lonlat.toLeaflet))

type Props = {
  bidirectional: boolean,
  highlightSegment?: number,
  highlightStop?: any,
  segments: Segment[]
}

type State = {
  directionalMarkerPatterns: [
    {
      geometry: {
        coordinates: number[]
      }
    }
  ],
  geojson: FeatureCollection,
  stopRadius: number,
  stops: Stop[]
}

/**
 * A layer to display (not edit) an added trip pattern
 */
export class AddTripPatternLayer extends React.Component {
  props: Props
  state: State
  state = {}

  static getDerivedStateFromProps (props) {
    const zoom = props.leaflet.map.getZoom()
    return {
      newStopIcon: getNewStopIconForZoom(zoom),
      newSnappedStopIcon: getSnappedStopIconForZoom(zoom)
    }
  }

  constructor (props) {
    super(props)
    props.leaflet.map.on('zoomend', this._onZoomend)
  }

  componentWillUnmount () {
    this.props.leaflet.map.off('zoomend', this._onZoomend)
  }

  _onZoomend = () => {
    const z = this.props.leaflet.map.getZoom()
    this.setState({
      newStopIcon: getNewStopIconForZoom(z),
      newSnappedStopIcon: getSnappedStopIconForZoom(z)
    })
  }

  render () {
    const {newStopIcon, newSnappedStopIcon} = this.state
    const {
      bidirectional,
      highlightSegment,
      highlightStop,
      segments
    } = this.props
    const coordinates = memoizedGetCoordinatesFromSegments(segments)
    const directionalMarkerPatterns = [{geometry: {coordinates}}]
    const segmentsPolylinePositions = coordinatesToLeaflet(coordinates)
    const stops = memoizedGetStops(segments)

    return (
      <>
        <Polyline
          color={colors.ADDED}
          positions={segmentsPolylinePositions}
          weight={NEW_LINE_WEIGHT}
        />
        {highlightSegment !== undefined &&
          highlightSegment > -1 &&
          <Polyline
            color={colors.HIGHLIGHT}
            opacity={0.5}
            positions={segments[highlightSegment].geometry.coordinates.map(c => lonlat.toLeaflet(c))}
            weight={NEW_LINE_WEIGHT * 3}
          />}
        {!bidirectional &&
          <DirectionalMarkers
            color={colors.ADDED}
            patterns={directionalMarkerPatterns}
          />}
        {stops.map((s, i) =>
          <Marker
            icon={s.stopId ? newSnappedStopIcon : newStopIcon}
            key={`stop-${i}`}
            position={s}
          />)}
        {highlightStop &&
          <Marker
            icon={enlargeIconBy(highlightStop.stopId ? newSnappedStopIcon : newStopIcon, 2)}
            position={highlightStop}
          />}
      </>
    )
  }
}

export default withLeaflet(AddTripPatternLayer)
