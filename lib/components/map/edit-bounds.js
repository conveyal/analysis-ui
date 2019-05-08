import lonlat from '@conveyal/lonlat'
import {LatLngBounds} from 'leaflet'
import React, {Component} from 'react'
import {Marker, Rectangle, withLeaflet} from 'react-leaflet'

import {fromLatLngBounds, toLatLngBounds} from 'lib/utils/bounds'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

// Zoom to bounds, but don't zoom in too much.
const DEFAULT_MAX_ZOOM = 13

/** Edit bounds on a map */
export class EditBounds extends Component {
  componentDidMount() {
    this.props.leaflet.map.fitBounds(toLatLngBounds(this.props.bounds), {
      maxZoom: DEFAULT_MAX_ZOOM
    })
  }

  onDragEnd = oppositeCorner => e => {
    this.props.save(
      fromLatLngBounds(
        new LatLngBounds(
          lonlat.toLeaflet(reprojectCoordinates(e.target.getLatLng())),
          oppositeCorner
        )
      )
    )
  }

  render() {
    const {bounds} = this.props
    if (!bounds) return null
    const leafletBounds = toLatLngBounds(bounds)
    const ne = leafletBounds.getNorthEast()
    const nw = leafletBounds.getNorthWest()
    const se = leafletBounds.getSouthEast()
    const sw = leafletBounds.getSouthWest()
    return (
      <>
        <Marker draggable onDragEnd={this.onDragEnd(ne)} position={sw} />
        <Marker draggable onDragEnd={this.onDragEnd(se)} position={nw} />
        <Marker draggable onDragEnd={this.onDragEnd(sw)} position={ne} />
        <Marker draggable onDragEnd={this.onDragEnd(nw)} position={se} />
        <Rectangle bounds={leafletBounds} weight={2} />
      </>
    )
  }
}

export default withLeaflet(EditBounds)
