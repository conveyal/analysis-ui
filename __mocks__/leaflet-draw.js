/* global jest */

import Leaflet from './leaflet'

Leaflet.Control.Draw = function DrawControl () {
  this.options = {}
}

Leaflet.Draw = {
  Polygon: jest.fn(() => { return { enable: jest.fn(), disable: jest.fn() } })
}
