/** Report out an adjust-speed modification */

import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {latLngBounds} from 'leaflet'
import messages from '../../utils/messages'
import MiniMap from './mini-map'
import AdjustSpeedLayer from '../scenario-map/adjust-speed-layer'
import {getPatternsForModification} from '../../utils/patterns'
import {sprintf} from 'sprintf-js'

export default class AdjustSpeed extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    feedsById: PropTypes.object.isRequired
  }

  render () {
    const {modification, feedsById} = this.props
    const feed = feedsById[modification.feed]
    const route = feed.routesById[modification.routes[0]]

    const bounds = latLngBounds(
      Array.concat(
        ...route.patterns.map(p =>
          p.geometry.coordinates.map(([lat, lon]) => [lon, lat])
        )
      )
    )

    const patterns = getPatternsForModification({feed, modification})

    if (patterns == null) return <div />

    const allPatterns = patterns.length === route.patterns.length

    return (
      <div>
        <h3>
          {messages.scenario.route}:{' '}
          {!!route.route_short_name && route.route_short_name}{' '}
          {!!route.route_long_name && route.route_long_name}
        </h3>

        <MiniMap bounds={bounds}>
          <AdjustSpeedLayer feed={feed} modification={modification} />
        </MiniMap>

        {sprintf(messages.report.adjustSpeed.scale, modification.scale)}

        <br />

        {allPatterns
          ? <i>
            {messages.report.removeStops.allPatterns}
          </i>
          : <i>
            {messages.report.removeStops.somePatterns}
          </i>}

        {!allPatterns &&
          <ul>
            {patterns.map(p =>
              <li key={`pattern-${p.trips[0].trip_id}`}>
                {p.name}
              </li>
            )}
          </ul>}
      </div>
    )
  }
}
