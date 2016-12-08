/** report out an adjust-dwell-time modification */

import React, { Component, PropTypes } from 'react'
import {latLngBounds} from 'leaflet'
import messages from '../../utils/messages'
import MiniMap from './mini-map'
import PatternStopsLayer from '../scenario-map/pattern-stops-layer'
import colors from '../../constants/colors'
import {getPatternsForModification} from '../../utils/patterns'
import {sprintf} from 'sprintf-js'

export default class AdjustDwellTime extends Component {
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
          nullIsWildcard
          selectedStopColor={colors.MODIFIED}
          modification={modification} />
      </MiniMap>

      {modification.scale
        ? sprintf(messages.report.adjustDwellTime.scale, modification.value)
        : sprintf(messages.report.adjustDwellTime.set, modification.value)}

      <br />

      <i>{messages.report.adjustDwellTime.stopsModified}</i>
      <ul>
        {modification.stops && modification.stops.map(s => feed.stopsById[s]).map(s => <li key={`stop-${s.stop_id}`}>{s.stop_name}</li>)}
        {modification.stops == null && <li><i>{messages.report.adjustDwellTime.allStops}</i></li>}
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
