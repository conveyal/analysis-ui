/** Display a reroute modification in the report view */

import React, { Component, PropTypes } from 'react'
import {latLngBounds} from 'leaflet'
import MiniMap from './mini-map'
import RerouteLayer from '../scenario-map/reroute-layer'
import messages from '../utils/messages'
import {getPatternsForModification} from '../utils/patterns'
import getStops from '../scenario-map/transit-editor/get-stops'
import lineDistance from 'turf-line-distance'
import lineSlice from 'turf-line-slice'
import point from 'turf-point'
import Distance from './distance'
import Speed from './speed'

export default class Reroute extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    feed: PropTypes.object.isRequired
  }

  render () {
    let { modification, feedsById } = this.props
    let feed = feedsById[modification.feed]
    let route = feed.routesById[modification.routes[0]]

    let bounds = latLngBounds([
      ...Array.concat(...route.patterns.map(p => p.geometry.coordinates.map(([lat, lon]) => [lon, lat]))),
      ...Array.concat(...modification.segments.map(s => s.geometry.coordinates.map(([lat, lon]) => [lon, lat])))
    ])

    return <div>
      <MiniMap bounds={bounds}>
        <RerouteLayer feed={feed} modification={modification} />
      </MiniMap>

      {getPatternsForModification({ feed, modification }).map(this.renderPattern) }
    </div>
  }

  renderPattern = (pattern) => {
    let { modification, feedsById } = this.props
    let feed = feedsById[modification.feed]

    // all calculations below are in kilometers
    let patternLength = lineDistance(pattern.geometry, 'kilometers')
    let stops = getStops(modification.segments)
    let segmentLength = stops.slice(-1)[0].distanceFromStart / 1000

    // figure out removed segment length
    const fromStopIndex = modification.fromStop != null ? pattern.stops.findIndex((s) => s.stop_id === modification.fromStop) : 0
    // make sure to find a toStopIndex _after_ the fromStopIndex (helps with loop routes also)
    const toStopIndex = modification.toStop != null ? pattern.stops.findIndex((s, i) => i > fromStopIndex && s.stop_id === modification.toStop) : pattern.stops.length - 1

    let nStopsRemoved

    const modificationAppliesToThisPattern = fromStopIndex !== -1 && toStopIndex !== -1
    if (!modificationAppliesToThisPattern) return []

    if (fromStopIndex > -1 && toStopIndex > -1) nStopsRemoved = toStopIndex - fromStopIndex - 1 // -1 because it's an exclusive interval, don't include from and to stops
    else if (fromStopIndex === -1) nStopsRemoved = toStopIndex - 1
    else nStopsRemoved = pattern.stops.length - toStopIndex - 1

    let nStopsAdded = stops.length

    // the endpoints are included, subtract them off where they overlap with existing stops
    if (fromStopIndex > -1) nStopsAdded--
    if (toStopIndex > -1) nStopsAdded--

    // NB using indices here so we get an object even if fromStop or toStop is null
    // stops in pattern are in fact objects but they only have stop ID.
    const fromStop = feed.stopsById[pattern.stops[fromStopIndex].stop_id]
    const toStop = feed.stopsById[pattern.stops[toStopIndex].stop_id]

    const geometry = lineSlice(point([fromStop.stop_lon, fromStop.stop_lat]), point([toStop.stop_lon, toStop.stop_lat]), {
      type: 'Feature',
      geometry: pattern.geometry,
      properties: {}
    })

    const removedLengthThisPattern = lineDistance(geometry, 'kilometers')

    return <table className='table table-striped' key={`pattern-${pattern.trips[0].trip_id}`}>
      <tbody>
        <tr>
          <th>{messages.report.patternName}</th>
          <td>{pattern.name}</td>
        </tr>
        <tr>
          <th>{messages.report.reroute.originalLength}</th>
          <td><Distance km={patternLength} /></td>
        </tr>
        <tr>
          <th>{messages.report.reroute.newLength}</th>
          <td><Distance km={patternLength - removedLengthThisPattern + segmentLength} /></td>
        </tr>
        <tr>
          <th>{messages.report.reroute.segmentLength}</th>
          <td><Distance km={segmentLength} /></td>
        </tr>
        <tr>
          <th>{messages.report.reroute.lengthDelta}</th>
          <td><Distance km={segmentLength - removedLengthThisPattern} /></td>
        </tr>
        <tr>
          <th>{messages.report.reroute.segmentSpeed}</th>
          <td><Speed kmh={modification.speed} /></td>
        </tr>
        <tr>
          <th>{messages.report.reroute.segmentDwell}</th>
          <td>{modification.dwell}</td>
        </tr>
        <tr>
          <th>{messages.report.reroute.nStopsRemoved}</th>
          <td>{nStopsRemoved}</td>
        </tr>
        <tr>
          <th>{messages.report.reroute.nStopsAdded}</th>
          <td>{nStopsAdded}</td>
        </tr>
      </tbody>
    </table>
  }
}
