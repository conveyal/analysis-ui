// @flow
import lonlat from '@conveyal/lonlat'
import {LatLng, LatLngBounds, MapEvent} from 'leaflet'
import React, {Component} from 'react'
import {Marker, Rectangle, withLeaflet} from 'react-leaflet'

import reprojectCoordinates from '../../utils/reproject-coordinates'

// Zoom to bounds, but don't zoom in too much.
const DEFAULT_MAX_ZOOM = 13

/** Edit bounds on a map */
export class EditBounds extends Component {
  props: {
    bounds: LatLngBounds,
    save: (bounds: LatLngBounds) => void
  }

  componentDidMount () {
    this.props.leaflet.map.fitBounds(this.props.bounds, {maxZoom: DEFAULT_MAX_ZOOM})
  }

  onDragEnd = (oppositeCorner: LatLng) => (e: Event & {target: MapEvent}) => {
    this.props.save(new LatLngBounds(
      lonlat.toLeaflet(reprojectCoordinates(e.target.getLatLng())),
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
      <>
        <Marker draggable onDragEnd={this.onDragEnd(ne)} position={sw} />
        <Marker draggable onDragEnd={this.onDragEnd(se)} position={nw} />
        <Marker draggable onDragEnd={this.onDragEnd(sw)} position={ne} />
        <Marker draggable onDragEnd={this.onDragEnd(nw)} position={se} />
        <Rectangle bounds={bounds} weight={2} />
      </>
    )
  }
}

export default withLeaflet(EditBounds)
