/**
 * Main entry point for the new, React-based transit editor
 */

import dbg from 'debug'
import lonlng from 'lonlng'
import React, {PropTypes} from 'react'
import {FeatureGroup} from 'react-leaflet'

import {MINIMUM_SNAP_STOP_ZOOM_LEVEL} from '../../../constants'

import * as addStopToSegments from '../../../utils/add-stop-to-segments'
import getStopsFromSegments from '../../../utils/get-stops'
import getStopNearPoint from '../../../utils/get-stop-near-point'
import getSegment from '../../../utils/get-segment'
import ControlPoints from './control-points'
import StopLayer from './stop-layer'
import Stops from './stops'
import Segments from './segments'

const debug = dbg('transit-editor:index')

export default class TransitEditor extends FeatureGroup {
  static propTypes = {
    allowExtend: PropTypes.bool.isRequired,
    extendFromEnd: PropTypes.bool.isRequired,
    feeds: PropTypes.array.isRequired,
    followRoad: PropTypes.bool.isRequired,
    modification: PropTypes.object.isRequired,
    spacing: PropTypes.number.isRequired,
    updateModification: PropTypes.func.isRequired
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
    const {map} = this.context
    map.off('click', this.handleClick)
    map.off('mouseup', this.handleSegmentDragEnd)
  }

  /** get a stop ID at the specified location, or null if this is not near a stop */
  getStopNear (pointClickedOnMap) {
    const {map} = this.context
    const zoom = map.getZoom()
    if (zoom >= MINIMUM_SNAP_STOP_ZOOM_LEVEL) {
      return getStopNearPoint({
        latlng: lonlng(pointClickedOnMap),
        radiusPixels: 10,
        stops: this.state.snapStops,
        zoom
      })
    }
  }

  render () {
    // this should get cleared on each render
    this.draggingSegment = -1
    const {modification} = this.props
    const {snapStops, stops} = this.state

    return <g>
      <StopLayer
        stops={snapStops}
        />
      <Segments
        onMousedown={this.handleSegmentDragStart}
        segments={modification.segments}
        />
      <Stops
        onDelete={this._deletePoint}
        onDragend={this._dragPoint}
        onToggle={this._togglePoint}
        stops={stops}
        />
      <ControlPoints
        onDelete={this._deletePoint}
        onDragend={this._dragPoint}
        onToggle={this._togglePoint}
        segments={modification.segments}
        />
    </g>
  }

  _togglePoint = (index) => {
    const {modification, updateModification} = this.props
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

    updateModification({segments})
  }

  _deletePoint = async (index) => {
    const {followRoad, modification, updateModification} = this.props
    const segments = [...modification.segments]

    if (index === 0) {
      segments.shift() // well that was easy
      updateModification({segments})
    } else if (index === segments.length) { // nb stop index not hop index
      segments.pop()
      updateModification({segments})
    } else {
      // ok a little trickier
      const seg0 = segments[index - 1]
      const seg1 = segments[index]
      const newSegment = await getSegment({
        followRoad,
        from: seg0.geometry.coordinates[0],
        fromStopId: seg0.fromStopId,
        to: seg1.geometry.coordinates.slice(-1)[0],
        segments,
        spacing: seg0.spacing,
        stopAtEnd: seg1.stopAtEnd,
        stopAtStart: seg0.stopAtStart,
        toStopId: seg1.toStopId
      })
      segments.splice(index - 1, 2, newSegment)
      updateModification({segments})
    }
  }

  /** handle a user clicking on the map */
  handleClick = ({latlng}) => {
    debug(`click at ${latlng}`)
    const {allowExtend, extendFromEnd, modification} = this.props
    if (allowExtend) {
      let coordinates = lonlng.toCoordinates(latlng)
      let stopId = null
      const snapStop = this.getStopNear(latlng)

      if (snapStop) {
        coordinates = [snapStop.stop_lon, snapStop.stop_lat]
        stopId = snapStop.stop_id
      }

      // TODO make sure it's allowed to extend from whichever end we're trying to extend from (there may be a fixed from or to stop in a reroute modification)
      this.insertStop({
        coordinates,
        index: extendFromEnd ? modification.segments.length : -1,
        stopId
      })
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
    if (this.draggingSegment >= 0) { // make sure we are dragging a segment
      debug(`drag end segment ${this.draggingSegment}`)
      const coordinates = lonlng.toCoordinates(e.latlng)
      const index = this.draggingSegment
      this.draggingSegment = -1
      this.insertStop({
        coordinates,
        index,
        isStop: false
      })
    }
  }

  /** handle a user dragging a stop */
  _dragPoint = async (e, {autoCreated, index}) => {
    const pos = e.target.getLatLng()
    const snapStop = this.getStopNear(pos)
    let coordinates = lonlng.toCoordinates(pos)

    if (autoCreated) {
      this._dragAutoCreatedStop({coordinates, index, snapStop})
    } else {
      // a bona fide stop or control point has been dragged, move the stop
      this._dragStop({coordinates, index, snapStop})
    }
  }

  _dragAutoCreatedStop ({
    coordinates,
    index,
    snapStop
  }) {
    let stopId = null

    if (snapStop != null) {
      stopId = snapStop.stop_id
      coordinates = [snapStop.stop_lon, snapStop.stop_lat]
    }

    this.insertStop({
      coordinates,
      index,
      isStop: true,
      stopId
    })
  }

  async _dragStop ({
    coordinates,
    index,
    snapStop
  }) {
    const {followRoad, modification, updateModification} = this.props
    const segments = [...modification.segments]
    const isEnd = index === segments.length
    const isStart = index === 0
    const isStop = index === 0 ? segments[0].stopAtStart : segments[index - 1].stopAtEnd

    // don't snap control points
    let stopId = null
    if (isStop && snapStop != null) {
      stopId = snapStop.stop_id
      coordinates = [snapStop.stop_lon, snapStop.stop_lat]
    }

    if (!isStart) {
      const prevSeg = segments[index - 1]
      // will overwrite geometry and preserve other attributes
      const newSegment = await getSegment({
        followRoad,
        from: prevSeg.geometry.coordinates[0],
        segments,
        to: coordinates,
        ...prevSeg
      })

      newSegment.toStopId = stopId
      segments[index - 1] = newSegment
    }

    if (!isEnd) {
      const nextSeg = segments[index]
      // can be a point if only one stop has been created
      const newSegment = await getSegment({
        followRoad,
        from: coordinates,
        segments,
        to: nextSeg.geometry.type === 'LineString' ? nextSeg.geometry.coordinates.slice(-1)[0] : nextSeg.geometry.coordinates,
        ...nextSeg
      })

      newSegment.fromStopId = stopId
      segments[index] = newSegment
    }

    updateModification({segments})
  }

  /** insert a stop at the specified position. Specify -1 to insert at the beginning */
  async insertStop ({
    coordinates,
    index,
    isStop = true,
    stopId
  }) {
    const {followRoad, modification, spacing, updateModification} = this.props
    const segments = [...modification.segments]
    if (index === -1) {
      const newSegments = await addStopToSegments.atStart({
        coordinates,
        followRoad,
        isStop,
        segments,
        spacing,
        stopId
      })
      updateModification({segments: newSegments})
    } else if (index < segments.length) {
      const newSegments = await addStopToSegments.inMiddle({
        coordinates,
        followRoad,
        index,
        isStop,
        segments,
        stopId
      })
      updateModification({segments: newSegments})
    } else {
      const newSegments = await addStopToSegments.atEnd({
        coordinates,
        followRoad,
        index,
        isStop,
        segments,
        spacing,
        stopId
      })
      updateModification({segments: newSegments})
    }
  }
}

// feed-id-scope stops so that we can snap new patterns to stops from multiple feeds
function getStateFromProps ({
  feeds,
  modification
}) {
  const snapStops = [].concat(...feeds
    .map((feed) => feed.stops
      .map((gtfsStop) => ({
        stop_id: `${feed.id}:${gtfsStop.stop_id}`,
        stop_lat: gtfsStop.stop_lat,
        stop_lon: gtfsStop.stop_lon
      }))
    )
  )

  return {
    snapStops,
    stops: getStopsFromSegments(modification.segments)
  }
}
