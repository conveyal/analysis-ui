/** Select stops using a polygon select */

import { PropTypes } from 'react'
import { MapControl } from 'react-leaflet'
import DrawPolygon from './draw-polygon'
import inside from 'turf-inside'
import point from 'turf-point'

export default class StopSelectPolygon extends MapControl {
  static propTypes = {
    modification: PropTypes.object,
    action: PropTypes.string,
    replaceModification: PropTypes.func
  }

  componentWillMount () {
    this.leafletElement = new DrawPolygon(this.doSelect)
  }

  doSelect = (polygon) => {
    // get all hops from all (selected) patterns
    let patterns = this.props.data.feeds[this.props.modification.feed].routes.get(this.props.modification.routes[0]).patterns

    if (this.props.modification.trips !== null) {
      patterns = patterns.filter((pat) => pat.trips.findIndex((t) => this.props.modification.trips.indexOf(t.trip_id) > -1) > -1)
    }

    let hopsForPattern = patterns
        .map((p) => p.stops.map((stop, index, array) => index < array.length - 1 ? [stop.stop_id, array[index + 1].stop_id] : null))

    // smoosh hops from all patterns together
    let candidateHops = [].concat(...hopsForPattern).filter((hop) => hop != null)

    let hops = candidateHops.filter((hop) => {
      let s0 = this.props.data.feeds[this.props.modification.feed].stops.get(hop[0])
      let s1 = this.props.data.feeds[this.props.modification.feed].stops.get(hop[1])
      return inside(point([s0.stop_lon, s0.stop_lat]), polygon) && inside(point([s1.stop_lon, s1.stop_lat]), polygon)
    })

    let mod = Object.assign({}, this.props.modification)

    if (this.props.action === 'add') mod.hops = [...new Set([...mod.hops, ...hops])]
    else if (this.props.action === 'new') mod.hops = hops
    // manual search for hops. Look for existing hops that are also in the selection using findIndex
    else if (this.props.action === 'remove') mod.hops = mod.hops.filter((existing) => hops.findIndex((selected) => existing[0] === selected[0] && existing[1] === selected[1]) === -1)

    this.props.replaceModification(mod)
    this.props.setMapState({})
  }
}
