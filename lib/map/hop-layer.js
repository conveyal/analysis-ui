/** represent selected hops in an adjust-speed modification */

import lineSlice from 'turf-line-slice'
import point from 'turf-point'
import PatternLayer from './pattern-layer'
import colors from '../colors'
import { GeoJson } from 'react-leaflet'
import React from 'react'
import uuid from 'uuid'

export default class HopLayer extends PatternLayer {
  static defaultProps = {
    color: colors.NEUTRAL
  };

  render () {
    let ret = super.render()
    // if there are no hops selected, apply to entire pattern
    if (this.props.modification.hops == null) return ret

    let patterns = this.getPatterns()

    // not loaded
    if (patterns === null) return ret

    let selectedHopGeometries = []

    // sort out the hops
    for (let pattern of patterns) {
      // figure out selected hop indices then merge consecutive hops
      let selectedHopIndicesInPattern = []
      for (let hop of this.props.modification.hops) {
        // NB if same stop sequence appears twice, we'll only show the hop once.
        // This isn't that big a deal, as this is just a display
        let hopIndex = pattern.stops.findIndex((stop, index, stops) => index < stops.length - 1 && stops[index].stop_id === hop[0] && stops[index + 1].stop_id === hop[1])

        if (hopIndex === -1) continue // this hop is not in this pattern

        selectedHopIndicesInPattern.push(hopIndex)
      }

      // to avoid excessive line segmentation operations, we find consecutive hops and show them all at once as a single feature
      // the lineSlice operation is pretty intensive
      // uniquify and sort
      selectedHopIndicesInPattern = [...new Set(selectedHopIndicesInPattern)].sort()

      // merge consectuive hops
      // negative number less than -1 so it's not consecutive with hop 0
      let startHopIndex = -10
      let prevHopIndex = -10

      let makeGeometryIfNecessary = () => {
        if (startHopIndex >= 0) {
          // get geometry
          let fromStopId = pattern.stops[startHopIndex].stop_id
          let fromStop = this.props.data.feeds[this.props.modification.feed].stops.get(fromStopId)
          // get feature at end of hop
          let toStopId = pattern.stops[prevHopIndex + 1].stop_id
          let toStop = this.props.data.feeds[this.props.modification.feed].stops.get(toStopId)
          let geometry = lineSlice(point([fromStop.stop_lon, fromStop.stop_lat]), point([toStop.stop_lon, toStop.stop_lat]), {
            type: 'Feature',
            properties: {},
            geometry: pattern.geometry
          })

          selectedHopGeometries.push(geometry)
        }
      }

      for (let hopIndex of selectedHopIndicesInPattern) {
        if (startHopIndex < 0) startHopIndex = hopIndex

        if (hopIndex - 1 !== prevHopIndex && prevHopIndex >= 0) {
          // start of new hop sequence detected
          makeGeometryIfNecessary()
          startHopIndex = hopIndex
        }

        prevHopIndex = hopIndex
      }

      // last hop
      makeGeometryIfNecessary()
    }

    let data = {
      type: 'FeatureCollection',
      features: selectedHopGeometries
    }

    let { color, map, layerContainer } = this.props

    return <span>
      <GeoJson
        data={data}
        color={color}
        map={map}
        layerContainer={layerContainer}
        key={uuid.v4()}
        />
    </span>
  }
}
