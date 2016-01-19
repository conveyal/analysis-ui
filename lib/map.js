/**
 * manage the leaflet map
 * we go outside react-leaflet to do this, for performance
 * components using the map should call addLayer and removeLayer to add/remove layers from the map
 */

import React, {Component} from 'react'
import L from 'leaflet'

class Map extends Component {
  constructor (props) {
    super(props)
    this.rendered = false
  }

  addLayer (layer) {
    layer.addTo(this.map)
  }

  removeLayer (layer) {
    this.map.removeLayer(layer)
  }

  /** render method sets up leaflet on first invocation, then returns false to indicate that no more DOM trickery is desired */
  render () {
    if (this.rendered) return false
    this.rendered = true
    // ok to hard-wire id, this is a singleton
    return <div id='map' style={{width: '100%', height: '100%', padding: '0px'}}></div>
  }

  /** create the leaflet map */
  componentDidMount () {
    // Downtown Kansas City, MO, US
    this.map = L.map('map').setView([39.0970, -94.6053], 12)
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map)
  }
}

// this is a singleton
export default <Map />