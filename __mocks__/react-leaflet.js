/* global jest */

import React from 'react'

const ReactLeaflet = require.requireActual('react-leaflet')

// mock tile layer urls
process.env.LEAFLET_TILE_URL = 'mock.url/tile'

ReactLeaflet.GeoJson.prototype.render = function () {
  return <g type='GeoJson' data={this.props.data}>{this.props.children}</g>
}

ReactLeaflet.Marker.prototype.render = function () {
  return <g type='Marker' {...this.props}>{this.props.children}</g>
}

ReactLeaflet.Path.prototype.setStyle = jest.fn()

module.exports = ReactLeaflet
