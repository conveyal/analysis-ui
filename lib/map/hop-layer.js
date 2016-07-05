/** represent selected hops in an adjust-speed modification */

import React, {PropTypes} from 'react'
import {GeoJson, MapComponent} from 'react-leaflet'
import lineSlice from 'turf-line-slice'
import point from 'turf-point'
import uuid from 'uuid'

import colors from '../colors'
import {getPatternsForModification} from '../utils/patterns'

export default class HopLayer extends MapComponent {
  static propTypes = {
    color: PropTypes.string,
    feeds: PropTypes.object.isRequired,
    layerContainer: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired
  }

  static defaultProps = {
    color: colors.NEUTRAL
  }

  render () {
    const {color, dim, feeds, map, modification, layerContainer} = this.props
    const patterns = getPatternsForModification({dim, feeds, modification})
    const patternsLoaded = !!patterns
    if (patternsLoaded) {
      const selectedHopGeometries = []

      // sort out the hops
      for (const pattern of patterns) {
        // figure out selected hop indices then merge consecutive hops
        let selectedHopIndicesInPattern = []
        for (let hop of this.props.modification.hops) {
          // NB if same stop sequence appears twice, we'll only show the hop once.
          // This isn't that big a deal, as this is just a display
          const hopIndex = pattern.stops.findIndex((stop, index, stops) => index < stops.length - 1 && stops[index].stop_id === hop[0] && stops[index + 1].stop_id === hop[1])

          if (hopIndex !== -1) selectedHopIndicesInPattern.push(hopIndex)
        }

        // to avoid excessive line segmentation operations, we find consecutive hops and show them all at once as a single feature
        // the lineSlice operation is pretty intensive
        // uniquify and sort
        selectedHopIndicesInPattern = [...new Set(selectedHopIndicesInPattern)].sort()

        // merge consectuive hops
        // negative number less than -1 so it's not consecutive with hop 0
        let startHopIndex = -10
        let prevHopIndex = -10

        const makeGeometryIfNecessary = () => { // TODO: SIDE EFFECTS!!
          if (startHopIndex >= 0) {
            // get geometry
            const fromStopId = pattern.stops[startHopIndex].stop_id
            const fromStop = feeds[modification.feed].stops.get(fromStopId)
            // get feature at end of hop
            const toStopId = pattern.stops[prevHopIndex + 1].stop_id
            const toStop = feeds[modification.feed].stops.get(toStopId)
            const geometry = lineSlice(point([fromStop.stop_lon, fromStop.stop_lat]), point([toStop.stop_lon, toStop.stop_lat]), {
              type: 'Feature',
              properties: {},
              geometry: pattern.geometry
            })

            selectedHopGeometries.push(geometry)
          }
        }

        for (const hopIndex of selectedHopIndicesInPattern) {
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

      const data = {
        type: 'FeatureCollection',
        features: selectedHopGeometries
      }

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

    return <span></span>
  }
}
