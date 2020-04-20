import flatten from 'lodash/flatten'
import React from 'react'

import colors from 'lib/constants/colors'
import message from 'lib/message'
import L from 'lib/leaflet'

import P from '../p'
import PatternLayer from '../modifications-map/pattern-layer'

import MiniMap from './mini-map'

/**
 * Removed trips
 */
export default function RemoveTrips(p) {
  const {feedsById, modification} = p
  const feed = feedsById[modification.feed]
  const route = feed.routes.find((r) => r.route_id === modification.routes[0])

  const bounds = L.latLngBounds(
    flatten(
      route.patterns.map((p) =>
        p.geometry.coordinates.map(([lat, lon]) => [lon, lat])
      )
    )
  )

  return (
    <>
      <h3>
        {message('common.route')}:{' '}
        {!!route.route_short_name && route.route_short_name}{' '}
        {!!route.route_long_name && route.route_long_name}
      </h3>

      <MiniMap bounds={bounds}>
        <PatternLayer
          color={colors.REMOVED}
          feed={feed}
          modification={modification}
        />
      </MiniMap>

      {modification.trips == null && (
        <P>
          <i>{message('report.removeTrips.removeEntireRoute')}</i>
        </P>
      )}
      {modification.trips != null && (
        <P>
          <i>{message('report.removeTrips.removePatterns')}</i>
          <ul>
            {route.patterns
              .filter(
                (p) =>
                  p.trips.findIndex(
                    (t) => modification.trips.indexOf(t.trip_id) > -1
                  ) > -1
              )
              .map((p) => (
                <li key={`pattern-${p.trips[0].trip_id}`}>{p.name}</li>
              ))}
          </ul>
        </P>
      )}
    </>
  )
}
