/** select a single stop on the map */

import { PropTypes } from 'react'
import { MapControl } from 'react-leaflet'
import DrawPolygon from './draw-polygon'
import inside from '@turf/inside'
import {point} from '@turf/helpers'

export default class StopSelectPolygon extends MapControl {
  static propTypes = {
    action: PropTypes.string.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    routeStops: PropTypes.array.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.leafletElement = new DrawPolygon(this.doSelect)
  }

  doSelect = (polygon) => {
    const {action, modification, replaceModification, routeStops, setMapState} = this.props

    const stopIds = routeStops
      .filter(insidePolygon(polygon))
      .map(toId)

    const mod = Object.assign({}, modification)

    if (action === 'add') mod.stops = [...new Set([...mod.stops, ...stopIds])]
    else if (action === 'new') mod.stops = stopIds
    else if (action === 'remove') mod.stops = mod.stops.filter((sid) => stopIds.indexOf(sid) === -1)

    replaceModification(mod)
    setMapState({
      modification: null,
      state: null
    })
  }
}

const insidePolygon = (polygon) => (stop) => inside(point([stop.stop_lon, stop.stop_lat]), polygon)
const toId = (stop) => stop.stop_id
