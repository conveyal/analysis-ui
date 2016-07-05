/** A layer showing an add-stops modification */

import lineSlice from 'turf-line-slice'
import point from 'turf-point'
import PatternLayer from './pattern-layer'
import colors from '../colors'
import React from 'react'
import { GeoJson, FeatureGroup } from 'react-leaflet'

export default class AddStopsLayer extends PatternLayer {
  static defaultProps = {
    color: colors.NEUTRAL,
    removedColor: colors.REMOVED,
    addedColor: colors.ADDED
  };

  render () {
    let ret = super.render()

    let { map, layerContainer } = this.props

    let patterns = this.getPatterns()

    // not loaded
    if (patterns === null) return ret
    if (this.props.data.feeds[this.props.modification.feed] == null) return ret

    return <FeatureGroup map={map} layerContainer={layerContainer}>
      {this.renderPatternGeometry({ patterns, color: colors.NEUTRAL })}
      {this.getDirectionalMarkers({ patterns, color: colors.NEUTRAL })}
      {this.renderRemovedSegments()}
      {this.renderAddedSegments()}
    </FeatureGroup>
  }

  renderRemovedSegments () {
    // null check in render method
    let feed = this.props.data.feeds[this.props.modification.feed]
    let { dim, modification } = this.props

    return this.getPatterns().map((pattern) => {
      // make sure the modification applies to this pattern. If the modification doesn't have a start or end stop, just use the first/last stop as this is
      // just for display and we can't highlight past the stops anyhow
      let fromStopIndex = this.props.modification.fromStop != null ? pattern.stops.findIndex((s) => s.stop_id === this.props.modification.fromStop) : 0
      // make sure to find a toStopIndex _after_ the fromStopIndex (helps with loop routes also)
      let toStopIndex = this.props.modification.toStop != null ? pattern.stops.findIndex((s, i) => i > fromStopIndex && s.stop_id === this.props.modification.toStop) : pattern.stops.length - 1

      if (fromStopIndex === -1 || toStopIndex === -1) return null // modification does not apply to this pattern

      // NB using indices here so we get an object even if fromStop or toStop is null
      // stops in pattern are in fact objects but they only have stop ID.
      let fromStop = feed.stops.get(pattern.stops[fromStopIndex].stop_id)
      let toStop = feed.stops.get(pattern.stops[toStopIndex].stop_id)

      let geometry = lineSlice(point([fromStop.stop_lon, fromStop.stop_lat]), point([toStop.stop_lon, toStop.stop_lat]), {
        type: 'Feature',
        geometry: pattern.geometry,
        properties: {}
      })

      return <GeoJson
        data={geometry}
        color={colors.REMOVED}
        opacity={dim ? 0.1 : 1}
        weight={3}
        key={`${modification.id}-removed-from-${pattern.trips[0].trip_id}`}
        />
    })
    .filter((layer) => layer != null)
  }

  renderAddedSegments () {
    let { dim, modification } = this.props

    // render the rerouted section
    let coll = {
      type: 'FeatureCollection',
      features: this.props.modification.segments.map((seg) => {
        return {
          type: 'Feature',
          geometry: seg.geometry,
          properties: {}
        }
      })
    }

    return [<GeoJson
      data={coll}
      color={colors.ADDED}
      opacity={dim ? 0.1 : 1}
      weight={3}
      key={`${modification.id}-added}`}
      />]
  }
}
