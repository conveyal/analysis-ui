/** Select stops using a polygon select */

import {PropTypes} from 'react'
import {MapControl} from 'react-leaflet'
import inside from '@turf/inside'
import {point} from '@turf/helpers'

import DrawPolygon from './draw-polygon'

export default class HopSelectPolygon extends MapControl {
  static propTypes = {
    action: PropTypes.string.isRequired,
    feed: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.leafletElement = new DrawPolygon(this.doSelect)
  }

  doSelect = (polygon) => {
    const {action, feed, modification, replaceModification, setMapState} = this.props
    // get all hops from all (selected) patterns
    let patterns = feed.routesById[modification.routes[0]].patterns

    if (modification.trips !== null) {
      patterns = patterns.filter((pat) => pat.trips.findIndex((t) => modification.trips.indexOf(t.trip_id) > -1) > -1)
    }

    const hopsForPattern = patterns
      .map((p) => p.stops.map((stop, index, array) => index < array.length - 1 ? [stop.stop_id, array[index + 1].stop_id] : null))

    // smoosh hops from all patterns together
    const candidateHops = [].concat(...hopsForPattern).filter((hop) => hop != null)

    const hops = candidateHops.filter((hop) => {
      const s0 = feed.stopsById[hop[0]]
      const s1 = feed.stopsById[hop[1]]
      return inside(point([s0.stop_lon, s0.stop_lat]), polygon) && inside(point([s1.stop_lon, s1.stop_lat]), polygon)
    })

    const mod = {...modification}

    if (action === 'add') mod.hops = [...new Set([...mod.hops, ...hops])]
    else if (action === 'new') mod.hops = hops
    // manual search for hops. Look for existing hops that are also in the selection using findIndex
    else if (action === 'remove') mod.hops = mod.hops.filter((existing) => hops.findIndex((selected) => existing[0] === selected[0] && existing[1] === selected[1]) === -1)

    replaceModification(mod)
    setMapState({
      modification: null,
      state: null
    })
  }
}
