/**
 * Main entry point for the new, React-based transit editor
 */

import { FeatureGroup, Marker } from 'react-leaflet'
import GeoJsonMousedown from './geojson-mousedown'
import { latLng } from 'leaflet'
import dbg from 'debug'
import lineString from 'turf-linestring'
import distance from 'turf-distance'
import point from 'turf-point'
import React from 'react'
import uuid from 'uuid'
import fontawesomeIcon from '../fontawesome-icon'
import StopLayer from './stop-layer'

const debug = dbg('transit-editor:index')

const MIN_STOP_SNAP_ZOOM = 12
const CIRCUMFERENCE_OF_EARTH_METERS = 40000000

function rad (deg) {
  return deg * Math.PI / 180
}

export default class TransitEditor extends FeatureGroup {
  constructor (props) {
    super(props)
    this.state = this.getStateFromProps(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.setState(this.getStateFromProps(newProps))
  }

  componentDidMount () {
    super.componentDidMount()

    // this is pretty cloogy but I can't figure out how to use react-leaflet events to listen to parent events.
    this.props.map.on('click', this.handleClick)
    this.props.map.on('mouseup', this.handleSegmentDragEnd)
  }

  componentWillUnmount () {
    this.props.map.off('click', this.handleClick)
  }

  /** get a stop ID at the specified location, or null if this is not near a stop */
  getStopNear ({ lng, lat, radiusMeters, radiusPixels = 10 }) {
    if (this.props.map.getZoom() < MIN_STOP_SNAP_ZOOM) return null // don't snap at zoom levels where we're not showing stops

    // base snap distance on map zoom, make it five pixels
    if (radiusMeters === undefined) {
      let metersPerPixel = CIRCUMFERENCE_OF_EARTH_METERS / (256 * Math.pow(2, this.props.map.getZoom()))
      radiusMeters = radiusPixels * metersPerPixel
    }

    let dLat = 360 * radiusMeters / CIRCUMFERENCE_OF_EARTH_METERS
    let dLng = Math.abs(dLat / Math.cos(rad(lat)))

    let maxLat = lat + dLat
    let minLat = lat - dLat
    let maxLng = lng + dLng
    let minLng = lng - dLng

    let query = this.state.snapStops.filter((s) => s.stop_lat > minLat && s.stop_lat < maxLat && s.stop_lon > minLng && s.stop_lon < maxLng)
    let clickPoint = point([lng, lat])

    // filter using true distance
    let stopAtDistance = query
      .map((stop) => {
        return {
          distance: distance(clickPoint, point([stop.stop_lon, stop.stop_lat]), 'kilometers'),
          stop
        }
      })
      .filter((s) => s.distance < radiusMeters / 1000)

    // return closest
    let outStop = null
    let outDist = Infinity

    for (let { stop, distance } of stopAtDistance) {
      if (distance < outDist) {
        outStop = stop
        outDist = distance
      }
    }

    return outStop
  }

  getStateFromProps (props) {
    const snapStops = [].concat(...Object.values(props.data.feeds)
      .map((v) => [...v.stops.values()]
        // feed-id-scope stops so that we can snap new patterns to stops from multiple feeds
        .map((gtfsStop) => {
          return {
            stop_id: `${v.feed_id}:${gtfsStop.stop_id}`,
            stop_lat: gtfsStop.stop_lat,
            stop_lon: gtfsStop.stop_lon
          } })
        )
      )

    return { snapStops, extendFromEnd: this.props.modification.toStopId == null }
  }

  render () {
    // this should get cleared on each render
    this.draggingSegment = -1

    return <span>
      {[
        ...this.renderSnapStops(),
        ...this.renderSegments(),
        ...this.renderAutocreatedStops(),
        ...this.renderBonaFideStops()
      ]}
    </span>
  }

  /** render the canvas layer showing stops to snap to */
  renderSnapStops () {
    return [<StopLayer map={this.props.map} stops={this.state.snapStops} minZoom={MIN_STOP_SNAP_ZOOM} />]
  }

  renderSegments () {
    return this.props.modification.segments
      .map((s) => {
        return {
          type: 'Feature',
          properties: {},
          geometry: s.geometry
        }
      })
      .map((data, index) =>
        <GeoJsonMousedown
          data={data}
          map={this.props.map}
          // GeoJSON layers don't update on props change, so use a UUID as key to force replacement on redraw
          key={uuid.v4()}
          onMousedown={this.handleSegmentDragStart.bind(this, index)}
          />
      )
  }

  /** render stops that (will be) automatically created */
  renderAutocreatedStops () {
    // TODO auto create stops
    return []
  }

  /** render stops specified in the segments array */
  renderBonaFideStops () {
    let ret = []

    this.props.modification.segments.forEach((segment, index) => {
      if (index === 0) {
        // it can be a linestring, or a point if this modification only has a single stop so far
        // (of course it would make no sense for a finished transit line to only have one stop, but hey, you gotta start somewhere)
        let coord = segment.geometry.type === 'LineString' ? segment.geometry.coordinates[0] : segment.geometry.coordinates
        ret.push(this.createMarker({
          index,
          coord,
          isStop: segment.stopAtStart,
          autoCreated: false,
          snapped: segment.fromStopId != null
        }))
      }

      if (segment.geometry.type === 'LineString') {
        let coord = segment.geometry.coordinates.slice(-1)[0]
        ret.push(this.createMarker({
          index: index + 1,
          coord,
          isStop: segment.stopAtEnd,
          autoCreated: false,
          snapped: segment.toStopId != null
        }))
      }
    })

    return ret
  }

  /** handle a user clicking on the map */
  handleClick = (e) => {
    debug(`click at ${e.latlng}`)

    let coord = [e.latlng.lng, e.latlng.lat]

    let snapStop = this.getStopNear(e.latlng)

    let stopId = null

    if (snapStop != null) {
      coord = [snapStop.stop_lon, snapStop.stop_lat]
      stopId = snapStop.stop_id
    }

    // TODO make sure it's allowed to extend from whichever end we're trying to extend from (there may be a fixed from or to stop in an add-stops modification)
    this.insertStop(this.state.extendFromEnd ? this.props.modification.segments.length : -1, coord, stopId)
  }

  /** handle the start of dragging a segment */
  handleSegmentDragStart (index, e) {
    debug(`dragging segment ${index}`)
    this.draggingSegment = index
    e.originalEvent.stopPropagation()
  }

  /** handle a mouseup event, which may be the end of dragging a segment */
  handleSegmentDragEnd = (e) => {
    if (this.draggingSegment < 0) return // we are not dragging a segment

    debug(`drag end segment ${this.draggingSegment}`)

    let index = this.draggingSegment
    this.draggingSegment = -1
    this.insertStop(index, [e.latlng.lng, e.latlng.lat], null, false)
  }

  /** handle a user dragging a stop */
  dragStop (index, e) {
    let segments = [...this.props.modification.segments]

    let pos = e.target.getLatLng()
    let coord = [pos.lng, pos.lat]

    if (index > 0) {
      let prevSeg = segments[index - 1]
      // will overwrite geometry and preserver other attributes
      let newSeg = this.getSegment({ from: prevSeg.geometry.coordinates[0], to: coord, ...prevSeg })
      segments[index - 1] = newSeg
    }

    if (index < segments.length) {
      let nextSeg = segments[index]
      // can be a point if only one stop has been created
      let newSeg = this.getSegment({ from: coord, to: nextSeg.geometry.type === 'LineString' ? nextSeg.geometry.coordinates.slice(-1)[0] : nextSeg.geometry.coordinates, ...nextSeg })
      segments[index] = newSeg
    }

    this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
  }

  createMarker ({ index, coord, isStop, autoCreated, snapped }) {
    let icon
    if (isStop) {
      // TODO colors
      if (autoCreated) icon = fontawesomeIcon({ icon: 'subway', color: '#888' })
      else if (snapped) icon = fontawesomeIcon({ icon: 'subway', color: '#48f' })
      else icon = fontawesomeIcon({ icon: 'subway', color: '#000' })
    } else {
      icon = fontawesomeIcon({ icon: 'circle', color: '#888', iconSize: 16 })
    }

    return <Marker
      position={latLng(coord[1], coord[0])}
      map={this.props.map}
      draggable
      onDragend={this.dragStop.bind(this, index)}
      key={`marker-${index}`}
      icon={icon}
      />
  }

  /** insert a stop at the specified position. Specify -1 to insert at the beginning */
  insertStop (index, coord, stopId, isStop = true) {
    // create the new segment(s)

    let segments = [...this.props.modification.segments]

    if (index > -1 && index < segments.length) {
      // replacing one segment with two in the middle
      let sourceSegment = segments[index]

      let seg0 = this.getSegment({
        from: sourceSegment.geometry.coordinates[0],
        to: coord,
        spacing: sourceSegment.spacing,
        stopAtStart: sourceSegment.stopAtStart,
        stopAtEnd: isStop,
        fromStopId: sourceSegment.fromStopId,
        toStopId: stopId
      })

      let seg1 = this.getSegment({
        from: coord,
        to: sourceSegment.geometry.coordinates.slice(-1)[0],
        spacing: sourceSegment.spacing,
        stopAtStart: isStop,
        stopAtEnd: sourceSegment.stopAtEnd,
        fromStopId: stopId,
        toStopId: sourceSegment.toStopId
      })

      // swap out the segments
      segments.splice(index, 1, seg0, seg1)
    } else if (index === -1) {
      // insert at start
      let seg = this.getSegment({
        from: coord,
        // can also be a point if only one stop has been created
        to: segments[0].geometry.type === 'LineString' ? segments[0].geometry.coordinates[0] : segments[0].geometry.coordinates,
        stopAtStart: isStop,
        stopAtEnd: segments[0].stopAtStart,
        toStopId: segments[0].fromStopId,
        fromStopId: stopId
        // TODO: spacing
      })

      segments.unshift(seg)

      // if there was a segment that was just a point, get rid of it
      if (segments.length === 2 && segments[1].geometry.type === 'Point') segments.pop()
    } else {
      // insert at end
      let from, stopAtStart, fromStopId

      let lastSegIdx = segments.length - 1

      if (segments.length > 0) {
        from = segments[lastSegIdx].geometry.type === 'LineString' ? segments[lastSegIdx].geometry.coordinates.slice(-1)[0] : segments[lastSegIdx].geometry.coordinates
        stopAtStart = segments[lastSegIdx].stopAtEnd
        fromStopId = segments[lastSegIdx].toStopId
      } else {
        from = null
        stopAtStart = isStop
        fromStopId = null
      }

      let seg = this.getSegment({
        from,
        // can also be a point if only one stop has been created
        to: coord,
        stopAtStart,
        stopAtEnd: isStop,
        fromStopId,
        toStopId: stopId
        // TODO: spacing
      })

      segments.push(seg)

      // if there was a segment that was just a point, get rid of it
      if (segments.length === 2 && segments[0].geometry.type === 'Point') segments.shift()
    }

    this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
  }

  getSegment ({ from, to, spacing, stopAtStart, stopAtEnd, fromStopId, toStopId }) {
    // NB this is where we'd insert code to use a routing engine
    let geometry

    if (from != null && to != null) {
      geometry = lineString([from, to]).geometry
    } else {
      // start of geometry, from or to is undefined
      let coord = from || to
      geometry = point(coord).geometry
    }

    return {
      geometry,
      stopAtStart,
      stopAtEnd,
      spacing,
      fromStopId,
      toStopId
    }
  }
}
