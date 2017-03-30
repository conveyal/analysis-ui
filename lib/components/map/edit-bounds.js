/** Edit bounds on a map */

import {latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Marker, Rectangle} from 'react-leaflet'

export default class EditProjectBounds extends Component {
  static propTypes = {
    bounds: PropTypes.shape({
      north: PropTypes.number,
      east: PropTypes.number,
      south: PropTypes.number,
      west: PropTypes.number
    }),
    save: PropTypes.func.isRequired
  }

  static contextTypes = {
    map: PropTypes.object
  }

  ne () {
    const {bounds} = this.props
    const {north, east} = bounds
    return [north, east]
  }

  nw () {
    const {bounds} = this.props
    const {north, west} = bounds
    return [north, west]
  }

  sw () {
    const {bounds} = this.props
    const {south, west} = bounds
    return [south, west]
  }

  se () {
    const {bounds} = this.props
    const {south, east} = bounds
    return [south, east]
  }

  saveBounds = (bounds) => {
    const {save} = this.props
    save({
      north: bounds.getNorth(),
      east: bounds.getEast(),
      south: bounds.getSouth(),
      west: bounds.getWest()
    })
  }

  onSwDragEnd = (e) => {
    this.saveBounds(latLngBounds(e.target.getLatLng(), this.ne()))
  }

  onNeDragEnd = (e) => {
    this.saveBounds(latLngBounds(e.target.getLatLng(), this.sw()))
  }

  onSeDragEnd = (e) => {
    this.saveBounds(latLngBounds(e.target.getLatLng(), this.nw()))
  }

  onNwDragEnd = (e) => {
    this.saveBounds(latLngBounds(e.target.getLatLng(), this.se()))
  }

  render () {
    const {bounds} = this.props
    if (!bounds) return null
    const sw = this.sw()
    const ne = this.ne()
    const nw = this.nw()
    const se = this.se()
    return (
      <g>
        <Marker
          draggable
          onDragEnd={this.onSwDragEnd}
          position={sw}
          />
        <Marker
          draggable
          onDragEnd={this.onNwDragEnd}
          position={nw}
          />
        <Marker
          draggable
          onDragEnd={this.onNeDragEnd}
          position={ne}
          />
        <Marker
          draggable
          onDragEnd={this.onSeDragEnd}
          position={se}
          />
        <Rectangle
          bounds={[sw, ne]}
          weight={2}
          />
      </g>
    )
  }
}
