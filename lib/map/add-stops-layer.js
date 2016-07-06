/** A layer showing an add-stops modification */

import React, {PropTypes} from 'react'
import {FeatureGroup, GeoJson, MapComponent} from 'react-leaflet'
import lineSlice from 'turf-line-slice'
import point from 'turf-point'

import colors from '../colors'
import DirectionalMarkers from '../components/directional-markers'
import {Patterns as PatternGeometry} from '../components/geojson'
import {getPatternsForModification} from '../utils/patterns'

export default class AddStopsLayer extends MapComponent {
  static defaultProps = {
    color: colors.NEUTRAL,
    removedColor: colors.REMOVED,
    addedColor: colors.ADDED
  }

  static propTypes = {
    color: PropTypes.string,
    dim: PropTypes.bool,
    feeds: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired
  }

  render () {
    const {dim, feeds, modification} = this.props

    const patterns = getPatternsForModification(this.props)
    const patternsLoaded = !!patterns
    const feed = feeds[modification.feed]
    const feedsLoaded = !!feed
    if (patternsLoaded && feedsLoaded) {
      return (
        <FeatureGroup>
          <PatternGeometry
            color={colors.NEUTRAL}
            patterns={patterns}
            />
          <DirectionalMarkers
            color={colors.NEUTRAL}
            patterns={patterns}
            />
          {this.renderRemovedSegments({dim, feed, feeds, modification, patterns})}
          {this.renderAddedSegments({dim, modification})}
        </FeatureGroup>
      )
    } else {
      return <span></span>
    }
  }

  renderRemovedSegments ({
    dim,
    feed,
    modification,
    patterns
  }) {
    return patterns.map((pattern) => {
      // make sure the modification applies to this pattern. If the modification doesn't have a start or end stop, just use the first/last stop as this is
      // just for display and we can't highlight past the stops anyhow
      const fromStopIndex = modification.fromStop != null ? pattern.stops.findIndex((s) => s.stop_id === modification.fromStop) : 0
      // make sure to find a toStopIndex _after_ the fromStopIndex (helps with loop routes also)
      const toStopIndex = modification.toStop != null ? pattern.stops.findIndex((s, i) => i > fromStopIndex && s.stop_id === modification.toStop) : pattern.stops.length - 1

      const modificationAppliesToThisPattern = fromStopIndex !== -1 && toStopIndex !== -1
      if (modificationAppliesToThisPattern) {
        // NB using indices here so we get an object even if fromStop or toStop is null
        // stops in pattern are in fact objects but they only have stop ID.
        const fromStop = feed.stops.get(pattern.stops[fromStopIndex].stop_id)
        const toStop = feed.stops.get(pattern.stops[toStopIndex].stop_id)

        const geometry = lineSlice(point([fromStop.stop_lon, fromStop.stop_lat]), point([toStop.stop_lon, toStop.stop_lat]), {
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
      }
    })
    .filter((layer) => !!layer)
  }

  renderAddedSegments ({
    dim,
    modification
  }) {
    // render the rerouted section
    const coll = {
      type: 'FeatureCollection',
      features: modification.segments.map((seg) => {
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
