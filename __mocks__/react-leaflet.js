/* global jest */

import React from 'react'

const ReactLeaflet = require.requireActual('react-leaflet')

// mock tile layer urls
process.env.LEAFLET_TILE_URL = 'mock.url/tile'

ReactLeaflet.GeoJSON.prototype.createLeafletElement = function () {
  return {
    data: this.props.data,
    getLayers () {
      return []
    }
  }
}

ReactLeaflet.GeoJSON.prototype.render = function () {
  return (
    <g type='GeoJSON' data={this.props.data}>
      {this.props.children}
    </g>
  )
}

ReactLeaflet.Marker.prototype.render = function () {
  return (
    <g type='Marker' {...this.props}>
      {this.props.children}
    </g>
  )
}

ReactLeaflet.Path.prototype.setStyle = jest.fn()

module.exports = ReactLeaflet
