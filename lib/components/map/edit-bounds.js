// @flow
import {LatLng, LatLngBounds, MapEvent} from 'leaflet'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Marker, Rectangle} from 'react-leaflet'

import reprojectCoordinates from '../../utils/reproject-coordinates'

// Zoom to bounds, but don't zoom in too much.
const DEFAULT_MAX_ZOOM = 13

/** Edit bounds on a map */
export default class EditBounds extends Component {
  props: {
    bounds: LatLngBounds,
    save: (bounds: LatLngBounds) => void
  }

  static contextTypes = {
    map: PropTypes.object
  }

  componentDidMount () {
    this.context.map.fitBounds(this.props.bounds, {maxZoom: DEFAULT_MAX_ZOOM})
  }

  onDragEnd = (oppositeCorner: LatLng) => (e: Event & {target: MapEvent}) => {
    this.props.save(new LatLngBounds(
      reprojectCoordinates(e.target.getLatLng()),
      oppositeCorner
    ))
  }

  render () {
    const {bounds} = this.props
    if (!bounds) return null
    const ne = bounds.getNorthEast()
    const nw = bounds.getNorthWest()
    const se = bounds.getSouthEast()
    const sw = bounds.getSouthWest()
    return (
      <g>
        <Marker draggable onDragEnd={this.onDragEnd(ne)} position={sw} />
        <Marker draggable onDragEnd={this.onDragEnd(se)} position={nw} />
        <Marker draggable onDragEnd={this.onDragEnd(sw)} position={ne} />
        <Marker draggable onDragEnd={this.onDragEnd(nw)} position={se} />
        <Rectangle bounds={bounds} weight={2} />
      </g>
    )
  }
}
