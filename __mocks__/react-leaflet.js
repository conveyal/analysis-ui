/* global jest */

const ReactLeaflet = require.requireActual('react-leaflet')

ReactLeaflet.Path.prototype.setStyle = jest.fn()

module.exports = ReactLeaflet
