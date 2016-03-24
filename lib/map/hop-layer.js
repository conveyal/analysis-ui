/** represent selected hops in an adjust-speed modification */

import lineSlice from 'turf-line-slice'
import point from 'turf-point'
import PatternLayer from './pattern-layer'
import colors from '../colors'
import { geoJson } from 'leaflet'

export default class HopLayer extends PatternLayer {
  static defaultProps = {
    color: colors.NEUTRAL
  };

  render () {
    let ret = super.render()
    // if there are no hops selected, apply to entire pattern
    if (this.props.modification.hops == null) return ret

    this.leafletElement.clearLayers()

    let patterns = this.getPatterns()

    // not loaded
    if (patterns === null) return ret

    let selectedHops = []

    // sort out the hops
    for (let hop of this.props.modification.hops) {
      for (let pattern of patterns) {
        // NB if same stop sequence appears twice, we'll only show the hop once.
        // This isn't that big a deal, as this is just a display
        let hopIndex = pattern.stops.findIndex((stop, index, stops) => index < stops.length - 1 && stops[index].stop_id === hop[0] && stops[index + 1].stop_id === hop[1])

        if (hopIndex === -1) continue // this hop is not in this pattern

        // if we got this far we know the data is loaded
        let fromStop = this.props.data.feeds.get(this.props.modification.feed).stops.get(hop[0])
        let toStop = this.props.data.feeds.get(this.props.modification.feed).stops.get(hop[1])

        // segment the geometry
        // TODO this could be made more robust
        let hopGeom = lineSlice(point([fromStop.stop_lon, fromStop.stop_lat]), point([toStop.stop_lon, toStop.stop_lat]), {
          type: 'Feature',
          properties: {},
          geometry: pattern.geometry
        })

        selectedHops.push(hopGeom)
      }
    }

    this.leafletElement.addLayer(geoJson({
      type: 'FeatureCollection',
      features: selectedHops
    }, {
      style: {
        color: this.props.color,
        weight: 3
      }
    }))

    return ret
  }
}
