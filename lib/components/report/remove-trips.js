// @flow
import message from '@conveyal/woonerf/message'
import React, {PureComponent} from 'react'
import {latLngBounds} from 'leaflet'

import PatternLayer from '../modifications-map/pattern-layer'
import colors from '../../constants/colors'

import MiniMap from './mini-map'

/**
 * Removed trips
 */
export default class RemoveTrips extends PureComponent {
  render () {
    const {feedsById, modification} = this.props
    const feed = feedsById[modification.feed]
    const route = feed.routes.find(r => r.route_id === modification.routes[0])

    const bounds = latLngBounds(
      [].concat(
        route.patterns.map(p =>
          p.geometry.coordinates.map(([lat, lon]) => [lon, lat])
        )
      )
    )

    return (
      <div>
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

        {modification.trips == null &&
          <i>
            {message('report.removeTrips.removeEntireRoute')}
          </i>}
        {modification.trips != null &&
          <div>
            <i>
              {message('report.removeTrips.removePatterns')}
            </i>
            <ul>
              {route.patterns
                .filter(
                  p =>
                    p.trips.findIndex(
                      (t) => modification.trips.indexOf(t.trip_id) > -1
                    ) > -1
                )
                .map(p => (
                  <li key={`pattern-${p.trips[0].trip_id}`}>
                    {p.name}
                  </li>
                ))}
            </ul>
          </div>}
      </div>
    )
  }
}