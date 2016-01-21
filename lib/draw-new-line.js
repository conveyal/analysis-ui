/** Leaflet control for drawing a new line, using the Leaflet.draw drawing tools for now */

import L from 'leaflet'
import 'leaflet-draw'

const drawControl = new L.Control.Draw();

export default class DrawNewLine extends L.Control {
  constructor (callback, followStreets = false) {
    super()
    this.followStreets = false
    this.callback = callback
  }

  onAdd (map) {
    // http://stackoverflow.com/questions/15775103
    this.control = new L.Draw.Polyline(map, drawControl.options.polyline)
    this.map = map
    this.control.enable()

    this.map.on('draw:created', e => {
      this.callback(e.layer)
      this.map.off('draw:created')
    })

    // we have to return something so that leaflet creates a line
    return document.createElement('span')
  }

  onRemove (map) {
    this.control.disable()
  }
}
