/** A layer showing an add-stops modification */

import lineSlice from 'turf-line-slice'
import point from 'turf-point'
import PatternLayer from './pattern-layer'
import colors from '../colors'
import { geoJson } from 'leaflet'

export default class HopLayer extends PatternLayer {
  static defaultProps = {
    color: colors.NEUTRAL,
    removedColor: colors.REMOVED,
    addedColor: colors.ADDED
  };

  render () {
    let ret = super.render()

    this.leafletElement.clearLayers()

    let patterns = this.getPatterns()

    // not loaded
    if (patterns === null) return ret

    for (let pattern of patterns) {
      // make sure the modification applies to this pattern. If the modification doesn't have a start or end stop, just use the first/last stop as this is
      // just for display and we can't highlight past the stops anyhow
      let fromStopIndex = this.props.modification.fromStop != null ? pattern.stops.findIndex((s) => s.stop_id === this.props.modification.fromStop) : 0
      // make sure to find a toStopIndex _after_ the fromStopIndex (helps with loop routes also)
      let toStopIndex = this.props.modification.toStop != null ? pattern.stops.findIndex((s, i) => i > fromStopIndex && s.stop_id === this.props.modification.toStop) : pattern.stops.length - 1

      if (fromStopIndex === -1 || toStopIndex === -1) continue // modification does not apply to this pattern

      let feed = this.props.data.feeds[this.props.modification.feed]

      if (feed == null) return ret // data not loaded

      // NB using indices here so we get an object even if fromStop or toStop is null
      // stops in pattern are in fact objects but they only have stop ID.
      let fromStop = feed.stops.get(pattern.stops[fromStopIndex].stop_id)
      let toStop = feed.stops.get(pattern.stops[toStopIndex].stop_id)

      let segment = lineSlice(point([fromStop.stop_lon, fromStop.stop_lat]), point([toStop.stop_lon, toStop.stop_lat]), {
        type: 'Feature',
        geometry: pattern.geometry,
        properties: {}
      })
      this.leafletElement.addLayer(geoJson(segment, {
        color: this.props.removedColor,
        weight: 3
      }))
    }

    this.leafletElement.addLayer(geoJson({
      type: 'Feature',
      properties: {},
      geometry: this.props.modification.geometry
    }, {
      color: this.props.addedColor,
      weight: 3
    }))

    return ret
  }
}
