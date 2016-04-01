/** select a single stop on the map */

import { PropTypes } from 'react'
import { MapControl } from 'react-leaflet'
import DrawPolygon from './draw-polygon'
import inside from 'turf-inside'
import point from 'turf-point'

export default class StopSelectPolygon extends MapControl {
  static propTypes = {
    modification: PropTypes.object,
    action: PropTypes.string,
    routeStops: PropTypes.array,
    replaceModification: PropTypes.func,
    data: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.leafletElement = new DrawPolygon(this.doSelect)
  }

  doSelect = (polygon) => {
    let stops = this.props.routeStops.filter((s) => inside(point([s.stop_lon, s.stop_lat]), polygon))
      .map((s) => s.stop_id)

    let mod = Object.assign({}, this.props.modification)

    if (this.props.action === 'add') mod.stops = [...new Set([...mod.stops, ...stops])]
    else if (this.props.action === 'new') mod.stops = stops
    else if (this.props.action === 'remove') mod.stops = mod.stops.filter((sid) => stops.indexOf(sid) === -1)

    this.props.replaceModification(mod)
    this.props.setMapState({})
  }
}
