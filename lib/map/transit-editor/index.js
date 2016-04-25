/**
 * Main entry point for the new, React-based transit editor
 */

import {PropTypes} from 'react'
import { FeatureGroup, Marker, Popup } from 'react-leaflet'
import GeoJsonMousedown from './geojson-mousedown'
import { latLng } from 'leaflet'
import dbg from 'debug'
import lineString from 'turf-linestring'
import distance from 'turf-distance'
import point from 'turf-point'
import React from 'react'
import uuid from 'uuid'
import fontawesomeIcon from '../fontawesome-icon'
import messages from '../../messages'
import StopLayer from './stop-layer'
import getStops from './get-stops'

const debug = dbg('transit-editor:index')

const MIN_STOP_SNAP_ZOOM = 12
const CIRCUMFERENCE_OF_EARTH_METERS = 40000000

function rad (deg) {
  return deg * Math.PI / 180
}

export default class TransitEditor extends FeatureGroup {
  static propTypes = {
    allowExtend: PropTypes.bool.isRequired,
    extendFromEnd: PropTypes.bool.isRequired,
    layerContainer: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired
  }

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

    return { snapStops }
  }

  render () {
    // this should get cleared on each render
    this.draggingSegment = -1

    return <span>
      {[
        ...this.renderSnapStops(),
        ...this.renderSegments(),
        ...this.renderStops()
      ]}
    </span>
  }

  /** render the canvas layer showing stops to snap to */
  renderSnapStops () {
    return [<StopLayer map={this.props.map} layerContainer={this.props.layerContainer} stops={this.state.snapStops} minZoom={MIN_STOP_SNAP_ZOOM} key='snapStops' />]
  }

  toggleStop (index) {
    let segments = [...this.props.modification.segments]
    let currentlyStop = index === 0 ? segments[0].stopAtStart : segments[index - 1].stopAtEnd

    if (index < segments.length) {
      let newSeg = Object.assign({}, segments[index])
      newSeg.stopAtStart = !currentlyStop
      // if it's not a stop anymore, can't be snapped
      if (currentlyStop) newSeg.fromStopId = null
      segments[index] = newSeg
    }

    if (index > 0) {
      let newSeg = Object.assign({}, segments[index - 1])
      newSeg.stopAtEnd = !currentlyStop
      // if it's not a stop anymore, can't be snapped
      if (currentlyStop) newSeg.toStopId = null
      segments[index - 1] = newSeg
    }

    let updated = Object.assign({}, this.props.modification, { segments })

    if (!this.isValid(updated)) {
      throw new Error(`modification is not valid after toggling stop ${currentlyStop ? 'off' : 'on'}`)
    }

    this.props.replaceModification(updated)
  }

  deletePoint (index) {
    let segments = [...this.props.modification.segments]

    if (index === 0) {
      segments.shift() // well that was easy
    } else if (index === segments.length) { // nb stop index not hop index
      segments.pop()
    } else {
      // ok a little trickier
      let seg0 = segments[index - 1]
      let seg1 = segments[index]
      let segment = this.getSegment({
        from: seg0.geometry.coordinates[0],
        to: seg1.geometry.coordinates.slice(-1)[0],
        spacing: seg0.spacing,
        stopAtStart: seg0.stopAtStart,
        stopAtEnd: seg1.stopAtEnd,
        fromStopId: seg0.fromStopId,
        toStopId: seg1.toStopId
      })

      segments.splice(index - 1, 2, segment)
    }

    let updated = Object.assign({}, this.props.modification, { segments })

    if (!this.isValid(updated)) {
      throw new Error(`modification is not valid after deleting point ${index}`)
    }

    this.props.replaceModification(updated)
  }

  renderSegments () {
    let { map, layerContainer } = this.props

    return this.props.modification.segments
      // if there's just a single stop, don't render an additional marker
      .filter((s) => s.geometry.type !== 'Point')
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
          // GeoJSON layers don't update on props change, so use a UUID as key to force replacement on redraw
          key={uuid.v4()}
          onMousedown={this.handleSegmentDragStart.bind(this, index)}
          map={map}
          layerContainer={layerContainer}
          />
      )
  }

  /** render stops that (will be) automatically created */
  renderStops () {
    return getStops(this.props.modification)
      .map((s) => this.createMarker({
        index: s.index,
        autoCreated: s.autoCreated,
        snapped: s.stopId != null,
        coord: [s.lon, s.lat],
        isStop: true,
        bearing: s.bearing
      }))
  }

  /** handle a user clicking on the map */
  handleClick = (e) => {
    debug(`click at ${e.latlng}`)

    if (!this.props.allowExtend) return

    let coord = [e.latlng.lng, e.latlng.lat]

    let snapStop = this.getStopNear(e.latlng)

    let stopId = null

    if (snapStop != null) {
      coord = [snapStop.stop_lon, snapStop.stop_lat]
      stopId = snapStop.stop_id
    }

    // TODO make sure it's allowed to extend from whichever end we're trying to extend from (there may be a fixed from or to stop in an add-stops modification)
    this.insertStop(this.props.extendFromEnd ? this.props.modification.segments.length : -1, coord, stopId)
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
  dragStop (index, autoCreated, e) {
    let pos = e.target.getLatLng()
    let coord = [pos.lng, pos.lat]

    if (autoCreated) {
      // an autocreated stop has been dragged, create a new stop
      let snapStop = this.getStopNear(pos)
      let stopId = null

      if (snapStop != null) {
        stopId = snapStop.stop_id
        coord = [snapStop.stop_lon, snapStop.stop_lat]
      }

      this.insertStop(index, coord, stopId, true)
    } else {
      // a bona fide stop or control point has been dragged, move the stop
      let segments = [...this.props.modification.segments]

      let isStop = index === 0 ? segments[0].stopAtStart : segments[index - 1].stopAtEnd

      // don't snap control points
      let snapStop = isStop ? this.getStopNear(pos) : null
      let stopId = null

      if (snapStop != null) {
        stopId = snapStop.stop_id
        coord = [snapStop.stop_lon, snapStop.stop_lat]
      }

      if (index > 0) {
        let prevSeg = segments[index - 1]
        // will overwrite geometry and preserve other attributes
        let newSeg = this.getSegment({ from: prevSeg.geometry.coordinates[0], to: coord, ...prevSeg })
        newSeg.toStopId = stopId
        segments[index - 1] = newSeg
      }

      if (index < segments.length) {
        let nextSeg = segments[index]
        // can be a point if only one stop has been created
        let newSeg = this.getSegment({ from: coord, to: nextSeg.geometry.type === 'LineString' ? nextSeg.geometry.coordinates.slice(-1)[0] : nextSeg.geometry.coordinates, ...nextSeg })
        newSeg.fromStopId = stopId
        segments[index] = newSeg
      }

      this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
    }
  }

  createMarker ({ index, coord, isStop, autoCreated, snapped, bearing = false }) {
    let { map, layerContainer } = this.props

    let icon
    if (isStop) {
      if (autoCreated) icon = fontawesomeIcon({ icon: 'subway', color: '#888', bearing })
      else if (snapped) icon = fontawesomeIcon({ icon: 'subway', color: '#48f', bearing })
      else icon = fontawesomeIcon({ icon: 'subway', color: '#000', bearing })
    } else {
      icon = fontawesomeIcon({ icon: 'circle', color: '#888', iconSize: 16 })
    }

    return <Marker
      position={latLng(coord[1], coord[0])}
      draggable // TODO drag autocreated stops to fix them in place
      onDragend={this.dragStop.bind(this, index, autoCreated)}
      key={uuid.v4()} // TODO uuid's should not be used for keys
      icon={icon}
      map={map}
      layerContainer={layerContainer}
      >
      {this.renderPopup({autoCreated, index, isStop})}
    </Marker>
  }

  renderPopup ({autoCreated, index, isStop}) {
    if (!autoCreated) {
      return (
        <Popup>
          <span>
            <a href='#' onClick={(e) => this.toggleStop(index)}>{isStop ? messages.transitEditor.makeControlPoint : messages.transitEditor.makeStop}</a>&nbsp;
            <a href='#' onClick={(e) => this.deletePoint(index)}>{messages.transitEditor.deletePoint}</a>
          </span>
        </Popup>
      )
    }
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

      let to, stopAtEnd, toStopId

      // handle case of no existing stops
      if (segments.length > 0) {
        to = segments[0].geometry.type === 'LineString' ? segments[0].geometry.coordinates[0] : segments[0].geometry.coordinates
        // if segments[0] is a point, the from and to stop information are identical (see below) so we don't have to worry about
        // detecting that case here.
        stopAtEnd = segments[0].stopAtStart
        toStopId = segments[0].fromStopId
      } else {
        to = null // leave null so a point is created
        // duplicate all the information so it will be picked up when the next stop is created
        stopAtEnd = isStop
        toStopId = stopId
      }

      let seg = this.getSegment({
        from: coord,
        // can also be a point if only one stop has been created
        to,
        stopAtStart: isStop,
        stopAtEnd,
        toStopId,
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

      // handle creating the first stop. Note that we only support this when adding at the end.
      if (segments.length > 0) {
        from = segments[lastSegIdx].geometry.type === 'LineString' ? segments[lastSegIdx].geometry.coordinates.slice(-1)[0] : segments[lastSegIdx].geometry.coordinates
        stopAtStart = segments[lastSegIdx].stopAtEnd
        fromStopId = segments[lastSegIdx].toStopId
      } else {
        from = null
        stopAtStart = isStop
        fromStopId = stopId
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

    let updated = Object.assign({}, this.props.modification, { segments })

    if (!this.isValid(updated)) {
      throw new Error('Modification is not valid!')
    }

    this.props.replaceModification(updated)
  }

  getSegment ({ from, to, stopAtStart, stopAtEnd, fromStopId, toStopId, spacing }) {
    // NB this is where we'd insert code to use a routing engine
    let geometry

    if (spacing == null) {
      if (this.props.modification.segments.length > 0) spacing = this.props.modification.segments[0].spacing
      else spacing = 400 // auto stop creation on by default with 400m spacing
    }

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

  /** confirm that a modification is valid before saving */
  isValid (modification) {
    // confirm that the first geometry is a line string unless it's the only geometry
    if (modification.segments.length > 1) {
      for (let segment of modification.segments) {
        if (segment.geometry.type !== 'LineString') {
          debug(`Expected linestring geometry, got ${segment.geometry.type}`)
          return false
        }
      }

      for (let segIdx = 1; segIdx < modification.segments.length; segIdx++) {
        let s0 = modification.segments[segIdx - 1]
        let s1 = modification.segments[segIdx]
        if (s0.stopAtEnd !== s1.stopAtStart) {
          debug(`End stop flag does not match start stop flag of next segment at ${segIdx - 1}`)
          return false
        }

        if (s0.toStopId !== s1.fromStopId) {
          debug(`End stop ID does not match start stop ID of next segment at ${segIdx - 1}`)
          return false
        }

        let coord0 = s0.geometry.coordinates.slice(-1)[0]
        let coord1 = s1.geometry.coordinates[0]
        let epsilon = 1e-6

        if (Math.abs(coord0[0] - coord1[0]) > epsilon || Math.abs(coord0[1] - coord1[1]) > epsilon) {
          debug(`End coordinate does not match start coordinate of next segment at ${segIdx - 1}`)
          return false
        }
      }
    }

    // phew, all good
    return true
  }
}
