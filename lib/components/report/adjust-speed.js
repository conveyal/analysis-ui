/** Report out an adjust-speed modification */
import message from '@conveyal/woonerf/message'
import flatten from 'lodash/flatten'
import React from 'react'
import {latLngBounds} from 'leaflet'

import AdjustSpeedLayer from '../modifications-map/adjust-speed-layer'
import {getPatternsForModification} from '../../utils/patterns'

import MiniMap from './mini-map'

export default function AdjustSpeed (p) {
  const feed = p.feedsById[p.modification.feed]
  const route = feed.routes.find(r => r.route_id === p.modification.routes[0])

  const bounds = latLngBounds(
    ...flatten(
      route.patterns.map(p =>
        p.geometry.coordinates.map(([lat, lon]) => [lon, lat])
      )
    )
  )

  const patterns = getPatternsForModification({
    feed,
    modification: p.modification
  })

  if (patterns == null) return <div />

  const allPatterns = patterns.length === route.patterns.length

  return (
    <div>
      <h3>
        {message('common.route')}:{' '}
        {!!route.route_short_name && route.route_short_name}{' '}
        {!!route.route_long_name && route.route_long_name}
      </h3>

      <MiniMap bounds={bounds}>
        <AdjustSpeedLayer feed={feed} modification={p.modification} />
      </MiniMap>

      {message('report.adjustSpeed.scale', {scale: p.modification.scale})}

      <br />

      {allPatterns
        ? <i>
          {message('report.removeStops.allPatterns')}
        </i>
        : <i>
          {message('report.removeStops.somePatterns')}
        </i>}

      {!allPatterns &&
        <ul>
          {patterns.map(p => (
            <li key={`pattern-${p.trips[0].trip_id}`}>
              {p.name}
            </li>
          ))}
        </ul>}
    </div>
  )
}
