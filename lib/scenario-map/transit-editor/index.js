/**
 * Main entry point for the new, React-based transit editor
 */

import dbg from 'debug'
import {latLng} from 'leaflet'
import {isEqual as coordinatesAreEqual} from 'lonlng'
import React, {PropTypes} from 'react'
import {FeatureGroup, Marker, Popup} from 'react-leaflet'
import {pure} from 'recompose'
import lineString from 'turf-linestring'
import point from 'turf-point'
import uuid from 'uuid'

import {Button} from '../../components/buttons'
import fontawesomeIcon from '../fontawesome-icon'
import GeoJsonMousedown from './geojson-mousedown'
import messages from '../../messages'
import StopLayer from './stop-layer'
import getStops from './get-stops'
import getStopNearPoint from '../../utils/get-stop-near-point'
import {polyline as getPolyline} from '../../utils/valhalla'
import {isValid as modificationIsValid} from '../../utils/modification'

const debug = dbg('transit-editor:index')

const MIN_STOP_SNAP_ZOOM = 12

export default class TransitEditor extends FeatureGroup {
  static propTypes = {
    allowExtend: PropTypes.bool.isRequired,
    extendFromEnd: PropTypes.bool.isRequired,
    feeds: PropTypes.array.isRequired,
    followRoad: PropTypes.bool.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps) {
    this.setState(getStateFromProps(newProps))
  }

  componentDidMount () {
    super.componentDidMount()
    const {map} = this.context

    // this is pretty cloogy but I can't figure out how to use react-leaflet events to listen to parent events.
    map.on('click', this.handleClick)
    map.on('mouseup', this.handleSegmentDragEnd)
  }

  componentWillUnmount () {
    super.componentWillUnmount()

    this.context.map.off('click', this.handleClick)
    this.context.map.off('mouseup', this.handleSegmentDragEnd)
  }

  /** get a stop ID at the specified location, or null if this is not near a stop */
  getStopNear ({lng, lat, radiusMeters, radiusPixels = 10}) {
    const {map} = this.context
    const zoom = map.getZoom()
    if (zoom >= MIN_STOP_SNAP_ZOOM) {
      return getStopNearPoint({
        latlng: {lat, lng},
        radiusMeters,
        radiusPixels,
        stops: this.state.snapStops,
        zoom
      })
    }
  }

  render () {
    // this should get cleared on each render
    this.draggingSegment = -1
    const {modification} = this.props
    const {snapStops} = this.state

    return <g>
      <StopLayer
        stops={snapStops}
        minZoom={MIN_STOP_SNAP_ZOOM}
        />
      <Segments
        onMousedown={this.handleSegmentDragStart}
        segments={modification.segments}
        />
      <Stops
        onDelete={this.deletePoint}
        onDragend={this.dragStop}
        onToggle={this.toggleStop}
        stops={getStops(modification.segments)}
        />
      <ControlPoints
        segments={modification.segments}
        />
    </g>
  }

  toggleStop = (index) => {
    const {modification} = this.props
    const segments = [...modification.segments]
    const currentlyStop = index === 0 ? segments[0].stopAtStart : segments[index - 1].stopAtEnd

    if (index < segments.length) {
      const newSeg = {...segments[index]}
      newSeg.stopAtStart = !currentlyStop
      // if it's not a stop anymore, can't be snapped
      if (currentlyStop) newSeg.fromStopId = null
      segments[index] = newSeg
    }

    if (index > 0) {
      const newSeg = {...segments[index - 1]}
      newSeg.stopAtEnd = !currentlyStop
      // if it's not a stop anymore, can't be snapped
      if (currentlyStop) newSeg.toStopId = null
      segments[index - 1] = newSeg
    }

    this.replaceModificationSegments(segments)
  }

  deletePoint = (index) => {
    const {followRoad, modification} = this.props
    const segments = [...modification.segments]

    if (index === 0) {
      segments.shift() // well that was easy
      this.replaceModificationSegments(segments)
    } else if (index === segments.length) { // nb stop index not hop index
      segments.pop()
      this.replaceModificationSegments(segments)
    } else {
      // ok a little trickier
      const seg0 = segments[index - 1]
      const seg1 = segments[index]
      getSegment({
        followRoad,
        from: seg0.geometry.coordinates[0],
        fromStopId: seg0.fromStopId,
        to: seg1.geometry.coordinates.slice(-1)[0],
        segments,
        spacing: seg0.spacing,
        stopAtEnd: seg1.stopAtEnd,
        stopAtStart: seg0.stopAtStart,
        toStopId: seg1.toStopId
      }).then((segment) => {
        segments.splice(index - 1, 2, segment)
        this.replaceModificationSegments(segments)
      })
    }
  }

  replaceModificationSegments (segments) {
    const {modification, replaceModification} = this.props
    const updated = Object.assign({}, modification, { segments })

    if (!modificationIsValid(updated)) {
      throw new Error('modification is not valid after operation')
    }

    replaceModification(updated)
  }

  /** handle a user clicking on the map */
  handleClick = ({latlng}) => {
    debug(`click at ${latlng}`)
    const {allowExtend, extendFromEnd, modification} = this.props
    if (allowExtend) {
      let coord = [latlng.lng, latlng.lat]
      let stopId = null
      const snapStop = this.getStopNear(latlng)

      if (snapStop) {
        coord = [snapStop.stop_lon, snapStop.stop_lat]
        stopId = snapStop.stop_id
      }

      // TODO make sure it's allowed to extend from whichever end we're trying to extend from (there may be a fixed from or to stop in a reroute modification)
      this.insertStop(extendFromEnd ? modification.segments.length : -1, coord, stopId)
    }
  }

  /** handle the start of dragging a segment */
  handleSegmentDragStart = (e, index) => {
    debug(`dragging segment ${index}`)
    this.draggingSegment = index
    e.originalEvent.stopPropagation()
  }

  /** handle a mouseup event, which may be the end of dragging a segment */
  handleSegmentDragEnd = (e) => {
    if (this.draggingSegment < 0) return // we are not dragging a segment

    debug(`drag end segment ${this.draggingSegment}`)

    const index = this.draggingSegment
    this.draggingSegment = -1
    this.insertStop(index, [e.latlng.lng, e.latlng.lat], null, false)
  }

  /** handle a user dragging a stop */
  dragStop = (e, {autoCreated, index}) => {
    const {followRoad, modification} = this.props
    const pos = e.target.getLatLng()
    let coord = [pos.lng, pos.lat]

    if (autoCreated) {
      // an autocreated stop has been dragged, create a new stop
      const snapStop = this.getStopNear(pos)
      let stopId = null

      if (snapStop != null) {
        stopId = snapStop.stop_id
        coord = [snapStop.stop_lon, snapStop.stop_lat]
      }

      this.insertStop(index, coord, stopId, true)
    } else {
      // a bona fide stop or control point has been dragged, move the stop
      const segments = [...modification.segments]
      const isEnd = index === segments.length
      const isStart = index === 0
      const isStop = index === 0 ? segments[0].stopAtStart : segments[index - 1].stopAtEnd

      // don't snap control points
      const snapStop = isStop ? this.getStopNear(pos) : null
      let stopId = null

      if (snapStop != null) {
        stopId = snapStop.stop_id
        coord = [snapStop.stop_lon, snapStop.stop_lat]
      }

      const getNewSegments = []
      if (!isStart) {
        const prevSeg = segments[index - 1]
        // will overwrite geometry and preserve other attributes
        getNewSegments.push(getSegment({
          followRoad,
          from: prevSeg.geometry.coordinates[0],
          segments,
          to: coord,
          ...prevSeg
        }))
      }

      if (!isEnd) {
        const nextSeg = segments[index]
        // can be a point if only one stop has been created
        getNewSegments.push(getSegment({
          followRoad,
          from: coord,
          segments,
          to: nextSeg.geometry.type === 'LineString' ? nextSeg.geometry.coordinates.slice(-1)[0] : nextSeg.geometry.coordinates,
          ...nextSeg
        }))
      }

      Promise
        .all(getNewSegments)
        .then((newSegments) => {
          if (!isStart) {
            const newSegment = newSegments.shift()
            newSegment.toStopId = stopId
            segments[index - 1] = newSegment
          }
          if (!isEnd) {
            const newSegment = newSegments.shift()
            newSegment.fromStopId = stopId
            segments[index] = newSegment
          }
          this.replaceModificationSegments(segments)
        })
    }
  }

  /** insert a stop at the specified position. Specify -1 to insert at the beginning */
  insertStop (index, coord, stopId, isStop = true) {
    const {followRoad, modification} = this.props
    // create the new segment(s)
    const segments = [...modification.segments]
    if (index > -1 && index < segments.length) {
      // replacing one segment with two in the middle
      const sourceSegment = segments[index]
      Promise
        .all([
          getSegment({
            followRoad,
            from: sourceSegment.geometry.coordinates[0],
            fromStopId: sourceSegment.fromStopId,
            segments,
            spacing: sourceSegment.spacing,
            stopAtEnd: isStop,
            stopAtStart: sourceSegment.stopAtStart,
            to: coord,
            toStopId: stopId
          }),
          getSegment({
            followRoad,
            from: coord,
            fromStopId: stopId,
            segments,
            spacing: sourceSegment.spacing,
            stopAtEnd: sourceSegment.stopAtEnd,
            stopAtStart: isStop,
            to: sourceSegment.geometry.coordinates.slice(-1)[0],
            toStopId: sourceSegment.toStopId
          })
        ])
        .then(([seg0, seg1]) => {
          // swap out the segments
          segments.splice(index, 1, seg0, seg1)
          this.replaceModificationSegments(segments)
        })
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

      getSegment({
        followRoad,
        from: coord,
        fromStopId: stopId,
        // can also be a point if only one stop has been created
        segments,
        stopAtEnd,
        stopAtStart: isStop,
        to,
        toStopId
        // TODO: spacing
      }).then((segment) => {
        segments.unshift(segment)
        // if there was a segment that was just a point, get rid of it
        if (segments.length === 2 && segments[1].geometry.type === 'Point') segments.pop()
        this.replaceModificationSegments(segments)
      })
    } else {
      // insert at end
      let from, stopAtStart, fromStopId

      const lastSegIdx = segments.length - 1

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

      getSegment({
        followRoad,
        from,
        fromStopId,
        // can also be a point if only one stop has been created
        segments,
        stopAtEnd: isStop,
        stopAtStart,
        to: coord,
        toStopId: stopId
        // TODO: spacing
      }).then((seg) => {
        segments.push(seg)

        // if there was a segment that was just a point, get rid of it
        if (segments.length === 2 && segments[0].geometry.type === 'Point') segments.shift()
        this.replaceModificationSegments(segments)
      })
    }
  }
}

// feed-id-scope stops so that we can snap new patterns to stops from multiple feeds
function getStateFromProps ({feeds}) {
  const snapStops = [].concat(...feeds
    .map((feed) => feed.stops
      .map((gtfsStop) => {
        return {
          stop_id: `${feed.id}:${gtfsStop.stop_id}`,
          stop_lat: gtfsStop.stop_lat,
          stop_lon: gtfsStop.stop_lon
        } })
      )
    )

  return {snapStops}
}

async function getSegment ({
  followRoad,
  from,
  fromStopId,
  segments,
  spacing,
  stopAtEnd,
  stopAtStart,
  to,
  toStopId
}) {
  let geometry

  if (!spacing) {
    if (segments.length > 0) spacing = segments[0].spacing
    else spacing = 400 // auto stop creation on by default with 400m spacing
  }

  try {
    if (from && to) {
      if (followRoad) {
        const coordinates = await getPolyline({lng: from[0], lat: from[1]}, {lng: to[0], lat: to[1]})
        const c0 = coordinates[0]
        const cy = coordinates[coordinates.length - 1]
        const epsilon = 1e-6
        if (!coordinatesAreEqual(c0, from, epsilon)) {
          coordinates.unshift(from)
        }
        if (!coordinatesAreEqual(cy, to, epsilon)) {
          coordinates.push(to)
        }

        geometry = {
          type: 'LineString',
          coordinates
        }
      } else {
        geometry = await lineString([from, to]).geometry
      }
    } else {
      // start of geometry, from or to is undefined
      let coord = from || to
      geometry = await point(coord).geometry
    }
  } catch (e) {
    console.error(e.stack)
    throw e
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

const ControlPoints = pure(({
  onDelete,
  onDragend,
  onToggle,
  segments
}) => {
  const lastSegment = segments.slice(-1)[0]
  return <g>
    {segments
      .map((segment, index) => { return {...segment, index} })
      .filter((segment) => !segment.stopAtStart)
      .map((segment) => {
        const coordinates = segment.geometry.type === 'LineString'
          ? segment.geometry.coordinates[0]
          : segment.geometry.coordinates
        return <StopMarker
          autoCreated={false}
          onDragend={(e) => onDragend(e, {autoCreated: false, index: segment.index})}
          index={segment.index}
          isStop={false}
          key={`control-point-${segment.index}`}
          position={coordinates}
          />
      })
    }
    {lastSegment && !lastSegment.stopAtEnd &&
      <StopMarker
        autoCreated={false}
        onDragend={(e) => onDragend(e, {autoCreated: false, index: segments.length})}
        index={segments.length}
        isStop={false}
        position={lastSegment.geometry.type === 'LineString'
          ? lastSegment.geometry.coordinates[0]
          : lastSegment.geometry.coordinates}
        />
    }
  </g>
})

const Segments = pure(({
  onMousedown,
  segments
}) => {
  return <g>
    {segments
      .filter((segment) => segment.geometry.type !== 'Point') // if there's just a single stop, don't render an additional marker
      .map((segment) => {
        return {
          type: 'Feature',
          properties: {},
          geometry: segment.geometry
        }
      })
      .map((feature, index) =>
        <GeoJsonMousedown
          data={feature}
          key={uuid.v4()} // GeoJSON layers don't update on props change, so use a UUID as key to force replacement on redraw
          onMousedown={(e) => onMousedown(e, index)}
          />
      )}
  </g>
})

const Stops = pure(({
  onDelete,
  onDragend,
  onToggle,
  stops
}) => {
  return <g>
    {stops.map((stop, i) =>
      <StopMarker
        autoCreated={stop.autoCreated}
        bearing={stop.bearing}
        index={stop.index}
        isStop
        key={`stop-marker-${stop.index}-${i}`}
        onDragend={(e) => onDragend(e, stop)}
        position={latLng(stop.lat, stop.lon)}
        snapped={!!stop.stopId}
        />
    )}
  </g>
})

const StopMarker = pure(({
  autoCreated,
  bearing = false,
  index,
  isStop,
  onDelete,
  onDragend,
  onToggle,
  position,
  snapped
}) => {
  let icon
  if (isStop) {
    if (autoCreated) icon = fontawesomeIcon({ icon: 'subway', color: '#888', bearing })
    else if (snapped) icon = fontawesomeIcon({ icon: 'subway', color: '#48f', bearing })
    else icon = fontawesomeIcon({ icon: 'subway', color: '#000', bearing })
  } else {
    icon = fontawesomeIcon({ icon: 'circle', color: '#888', iconSize: 16 })
  }

  return <Marker
    position={position}
    draggable // TODO drag autocreated stops to fix them in place
    onDragend={onDragend}
    key={uuid.v4()} // TODO uuid's should not be used for keys
    icon={icon}
    >
    {!autoCreated &&
      <StopPopup
        isStop={isStop}
        onDelete={() => onDelete(index)}
        onToggle={() => onToggle(index)}
        />
    }
  </Marker>
})

const StopPopup = pure(({
  isStop,
  onDelete,
  onToggle
}) => {
  return <Popup>
    <div>
      <Button
        style='primary'
        onClick={onToggle}
        >{isStop ? messages.transitEditor.makeControlPoint : messages.transitEditor.makeStop}
      </Button>&nbsp;
      <Button
        style='danger'
        onClick={onDelete}
        >{messages.transitEditor.deletePoint}
      </Button>
    </div>
  </Popup>
})
