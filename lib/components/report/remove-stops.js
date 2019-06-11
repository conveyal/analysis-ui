/** show removed stops */
import message from '@conveyal/woonerf/message'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {latLngBounds} from 'leaflet'

import PatternStopsLayer from '../modifications-map/pattern-stops-layer'
import colors from '../../constants/colors'
import {getPatternsForModification} from '../../utils/patterns'

import MiniMap from './mini-map'

export default class RemoveStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    feedsById: PropTypes.object.isRequired
  }

  render () {
    const {modification, feedsById} = this.props
    const feed = feedsById[modification.feed]
    const route = feed.routes.find(r => r.route_id === modification.routes[0])

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
          {message('common.route')}:{' '}
          {!!route.route_short_name && route.route_short_name}{' '}
          {!!route.route_long_name && route.route_long_name}
        </h3>

        <MiniMap bounds={bounds}>
          <PatternStopsLayer
            feed={feed}
            selectedStopColor={colors.REMOVED}
            modification={modification}
          />
        </MiniMap>

        <i>
          {message('report.removeStops.stopsRemoved')}
        </i>
        <ul>
          {modification.stops &&
            modification.stops.map(s => feed.stopsById[s]).map(s => (
              <li key={`stop-${s.stop_id}`}>
                {s.stop_name}
              </li>
            ))}
        </ul>

        {modification.secondsSaved > 0 &&
          message('report.removeStops.secondsSaved', {
            secondsSaved: modification.secondsSaved
          })}

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
}