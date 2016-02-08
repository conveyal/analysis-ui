/** edit an existing line on the map */

import L from 'leaflet'
import 'leaflet-draw'

const drawControl = new L.Control.Draw();

export default class EditLine extends L.Control {
  constructor (line, callback, followStreets) {
    super()
    this.line = line
    this.callback = callback
    this.onEditFinished = this.onEditFinished.bind(this)
  }

  onAdd (map) {
    // save ref in this so that we can access the edited line below
    this.poly = L.polyline(this.line.coordinates.map(coord => L.latLng(coord[1], coord[0])))
    // NB going outside the redux flow here - if there are layer updates elsewhere in the map our layer will be lost
    // TODO could we just edit the GeoJSON layer already drawn directly?
    map.addLayer(this.poly)

    // http://stackoverflow.com/questions/15775103
    this.control = new L.Edit.Poly(this.poly, drawControl.options.polyline)
    this.map = map
    this.control.enable()

    let a = document.createElement('a')
    a.setAttribute('href', '#')
    a.innerText = 'stop editing'
    a.addEventListener('click', this.onEditFinished)

    let div = document.createElement('div')
    div.appendChild(a)
    return div
  }

  onEditFinished (e) {
    this.callback(this.poly)
  }

  onRemove (map) {
    this.control.disable()
  }
}
