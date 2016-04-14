/**
 * Main entry point for the new, React-based transit editor
 */

import { GeoJson, FeatureGroup, Marker } from 'react-leaflet'
import { latLng } from 'leaflet'
import dbg from 'debug'
import lineString from 'turf-linestring'
import point from 'turf-point'
import React from 'react'
import uuid from 'uuid'

const debug = dbg('transit-editor:index')

export default class TransitEditor extends FeatureGroup {
  constructor (props) {
    super(props)
    this.state = {
      // don't extend from end if the end position is fixed
      extendFromEnd: this.props.modification.toStopId == null
    }
  }

  componentDidMount () {
    super.componentDidMount()

    // this is pretty cloogy but I can't figure out how to use react-leaflet events to listen to parent events.
    this.props.map.on('click', this.handleClick)
  }

  componentWillUnmount () {
    this.props.map.off('click', this.handleClick)
  }

  render () {
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
    // TODO port canvas layer from existing react-leaflet implementation
    return []
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
      // GeoJSON layers don't update on props change, so use a UUID as key to force replacement on redraw
      .map((data, index) => <GeoJson data={data} map={this.props.map} key={uuid.v4()} />)
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
      if (index === 0 && segment.stopAtStart) {
        // it can be a linestring, or a point if this modification only has a single stop so far
        // (of course it would make no sense for a finished transit line to only have one stop, but hey, you gotta start somewhere)
        let coord = segment.geometry.type === 'LineString' ? segment.geometry.coordinates[0] : segment.geometry.coordinates
        ret.push(this.createStopMarker({
          index,
          coord,
          autoCreated: false,
          snapped: segment.fromStopId != null
        }))
      }

      if (segment.stopAtEnd && segment.geometry.type === 'LineString') {
        let coord = segment.geometry.coordinates.slice(-1)[0]
        ret.push(this.createStopMarker({
          index: index + 1,
          coord,
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

    // TODO make sure it's allowed to extend from whichever end we're trying to extend from (there may be a fixed from or to stop in an add-stops modification)
    this.insertStop(this.state.extendFromEnd ? this.props.modification.segments.length : -1, [e.latlng.lng, e.latlng.lat])
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

  createStopMarker ({ index, coord, autoCreated, snapped }) {
    return <Marker
      position={latLng(coord[1], coord[0])}
      map={this.props.map}
      draggable
      onDragend={this.dragStop.bind(this, index)}
      key={`stop-${index}`}
      />
  }

  /** insert a stop at the specified position. Specify -1 to insert at the beginning */
  insertStop (index, coord, isStop = true) {
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
        stopAtEnd: isStop
      })

      let seg1 = this.getSegment({
        from: coord,
        to: sourceSegment.geometry.coordinates.slice(-1)[0],
        spacing: sourceSegment.spacing,
        stopAtStart: isStop,
        stopAtEnd: sourceSegment.stopAtEnd
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
        stopAtEnd: segments[0].stopAtStart
        // TODO: spacing
      })

      segments.unshift(seg)

      // if there was a segment that was just a point, get rid of it
      if (segments.length === 2 && segments[1].geometry.type === 'Point') segments.pop()
    } else {
      // insert at end
      let from, stopAtStart

      let lastSegIdx = segments.length - 1

      if (segments.length > 0) {
        from = segments[lastSegIdx].geometry.type === 'LineString' ? segments[lastSegIdx].geometry.coordinates.slice(-1)[0] : segments[lastSegIdx].geometry.coordinates
        stopAtStart = segments[lastSegIdx].stopAtEnd
      } else {
        from = null
        stopAtStart = isStop
      }

      let seg = this.getSegment({
        from,
        // can also be a point if only one stop has been created
        to: coord,
        stopAtStart,
        stopAtEnd: isStop
        // TODO: spacing
      })

      segments.push(seg)

      // if there was a segment that was just a point, get rid of it
      if (segments.length === 2 && segments[0].geometry.type === 'Point') segments.shift()
    }

    this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
  }

  getSegment ({ from, to, spacing, stopAtStart, stopAtEnd }) {
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
      spacing
    }
  }
}
