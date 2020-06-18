import flatten from 'lodash/flatten'
import React from 'react'

import colors from 'lib/constants/colors'
import message from 'lib/message'
import L from 'lib/leaflet'
import {getPatternsForModification} from 'lib/utils/patterns'

import PatternLayer from '../modifications-map/pattern-layer'
import StopLayer from '../modifications-map/stop-layer'

import MiniMap from './mini-map'

export default function RemoveStops(props) {
  const {modification, feedsById} = props
  const feed = feedsById[modification.feed]
  const route = feed.routes.find((r) => r.route_id === modification.routes[0])

  const bounds = L.latLngBounds(
    flatten(
      route.patterns.map((p) =>
        p.geometry.coordinates.map(([lat, lon]) => [lon, lat])
      )
    )
  )

  const patterns = getPatternsForModification({feed, modification})

  if (patterns == null) return <div />

  const allPatterns = patterns.length === route.patterns.length

  return (
    <>
      <h3>
        {message('common.route')}:{' '}
        {!!route.route_short_name && route.route_short_name}{' '}
        {!!route.route_long_name && route.route_long_name}
      </h3>

      <MiniMap bounds={bounds}>
        <PatternLayer feed={feed} modification={modification} />
        <StopLayer
          selectedColor={colors.REMOVED}
          feed={feed}
          modification={modification}
        />
      </MiniMap>

      <i>{message('report.removeStops.stopsRemoved')}</i>
      <ul>
        {modification.stops &&
          modification.stops
            .map((s) => feed.stopsById[s])
            .map((s) => <li key={`stop-${s.stop_id}`}>{s.stop_name}</li>)}
      </ul>

      {modification.secondsSaved > 0 &&
        message('report.removeStops.secondsSaved', {
          secondsSaved: modification.secondsSaved
        })}

      {allPatterns ? (
        <i>{message('report.removeStops.allPatterns')}</i>
      ) : (
        <i>{message('report.removeStops.somePatterns')}</i>
      )}

      {!allPatterns && (
        <ul>
          {patterns.map((p) => (
            <li key={`pattern-${p.trips[0].trip_id}`}>{p.name}</li>
          ))}
        </ul>
      )}
    </>
  )
}
