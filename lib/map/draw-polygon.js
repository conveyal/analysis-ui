/** Leaflet control for drawing a polygon, using the Leaflet.draw drawing tools */

import L from 'leaflet'
import 'leaflet-draw'
import polygon from 'turf-polygon'

const drawControl = new L.Control.Draw()

export default class DrawPolygon extends L.Control {
  constructor (callback, followStreets = false) {
    super()
    this.followStreets = false
    this.callback = callback
  }

  onAdd (map) {
    // http://stackoverflow.com/questions/15775103
    this.control = new L.Draw.Polygon(map, drawControl.options.polygon)
    this.map = map
    this.control.enable()

    this.map.on('draw:created', e => {
      let coords = e.layer.getLatLngs().map(latLng => [latLng.lng, latLng.lat])

      // close the polygon
      if (coords.length > 0) coords.push(coords[0])

      // we only have one ring
      this.callback(polygon([coords]))
      this.map.off('draw:created')
    })

    // we have to return something so that leaflet creates a line
    return document.createElement('span')
  }

  onRemove (map) {
    this.control.disable()
  }
}
