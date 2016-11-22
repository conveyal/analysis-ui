/** show removed stops */

import React, { Component, PropTypes } from 'react'
import {latLngBounds} from 'leaflet'
import messages from '../../utils/messages'
import MiniMap from './mini-map'
import PatternStopsLayer from '../scenario-map/pattern-stops-layer'
import colors from '../../utils/colors'
import {getPatternsForModification} from '../../utils/patterns'

export default class RemoveStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    feedsById: PropTypes.object.isRequired
  }

  render () {
    let { modification, feedsById } = this.props
    let feed = feedsById[modification.feed]
    let route = feed.routesById[modification.routes[0]]

    let bounds = latLngBounds(Array.concat(...route.patterns.map(p => p.geometry.coordinates.map(([lat, lon]) => [lon, lat]))))

    let patterns = getPatternsForModification({ feed, modification })

    if (patterns == null) return <div />

    let allPatterns = patterns.length === route.patterns.length

    return <div>
      <h3>{messages.scenario.route}: {!!route.route_short_name && route.route_short_name} {!!route.route_long_name && route.route_long_name}</h3>

      <MiniMap bounds={bounds}>
        <PatternStopsLayer
          feed={feed}
          selectedStopColor={colors.REMOVED}
          modification={modification} />
      </MiniMap>

      <i>{messages.report.removeStops.stopsRemoved}</i>
      <ul>
        {modification.stops && modification.stops.map(s => feed.stopsById[s]).map(s => <li key={`stop-${s.stop_id}`}>{s.stop_name}</li>)}
      </ul>

      {allPatterns
        ? <i>{messages.report.removeStops.allPatterns}</i>
        : <i>{messages.report.removeStops.somePatterns}</i>}

      {!allPatterns && <ul>
        {patterns.map(p => <li key={`pattern-${p.trips[0].trip_id}`}>{p.name}</li>)}
      </ul>}
    </div>
  }
}
