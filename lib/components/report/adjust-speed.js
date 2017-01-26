/** Report out an adjust-speed modification */

import React, { Component, PropTypes } from 'react'
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
        <AdjustSpeedLayer
          feed={feed}
          modification={modification} />
      </MiniMap>

      {sprintf(messages.report.adjustSpeed.scale, modification.scale)}

      <br />

      {allPatterns
        ? <i>{messages.report.removeStops.allPatterns}</i>
        : <i>{messages.report.removeStops.somePatterns}</i>}

      {!allPatterns && <ul>
        {patterns.map(p => <li key={`pattern-${p.trips[0].trip_id}`}>{p.name}</li>)}
      </ul>}
    </div>
  }
}
