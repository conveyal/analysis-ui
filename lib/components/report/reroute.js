/** Display a reroute modification in the report view */
import flatten from 'lodash/flatten'
import React from 'react'
import turfLength from '@turf/length'
import lineSlice from '@turf/line-slice'
import {point} from '@turf/helpers'

import L from 'lib/leaflet'
import message from 'lib/message'
import {getPatternsForModification} from 'lib/utils/patterns'
import getStops from 'lib/utils/get-stops'
import {getAverageSpeedOfSegments} from 'lib/utils/segments'

import RerouteLayer from '../modifications-map/reroute-layer'

import Speed from './speed'
import MiniMap from './mini-map'
import Distance from './distance'

export default function Reroute(props) {
  const {modification, feedsById} = props
  const feed = feedsById[modification.feed]
  const route = feed.routes.find(r => r.route_id === modification.routes[0])

  const bounds = L.latLngBounds([
    ...flatten(
      route.patterns.map(p =>
        p.geometry.coordinates.map(([lat, lon]) => [lon, lat])
      )
    ),
    ...flatten(
      modification.segments.map(s =>
        s.geometry.coordinates.map(([lat, lon]) => [lon, lat])
      )
    )
  ])

  return (
    <div>
      <h3>
        {message('common.route')}:{' '}
        {!!route.route_short_name && route.route_short_name}{' '}
        {!!route.route_long_name && route.route_long_name}
      </h3>

      <MiniMap bounds={bounds}>
        <RerouteLayer feed={feed} modification={modification} />
      </MiniMap>

      {getPatternsForModification({feed, modification}).map((pattern, i) => (
        <Pattern pattern={pattern} key={`pattern-${i}`} {...props} />
      ))}
    </div>
  )
}

function Pattern(props) {
  const {modification, feedsById, pattern} = props
  const feed = feedsById[modification.feed]

  // all calculations below are in kilometers
  const patternLength = turfLength(pattern.geometry)
  const stops = getStops(modification.segments)
  const segmentLength = stops.slice(-1)[0].distanceFromStart / 1000
  const segmentDistances = modification.segments.map(seg =>
    turfLength(seg.geometry)
  )

  const {segmentSpeeds} = modification
  const speed = getAverageSpeedOfSegments({segmentDistances, segmentSpeeds})

  // figure out removed segment length
  const fromStopIndex =
    modification.fromStop != null
      ? pattern.stops.findIndex(s => s.stop_id === modification.fromStop)
      : 0
  // make sure to find a toStopIndex _after_ the fromStopIndex (helps with loop routes also)
  const toStopIndex =
    modification.toStop != null
      ? pattern.stops.findIndex(
          (s, i) => i >= fromStopIndex && s.stop_id === modification.toStop
        )
      : pattern.stops.length - 1

  const modificationAppliesToThisPattern =
    fromStopIndex !== -1 && toStopIndex !== -1
  if (!modificationAppliesToThisPattern) return []

  let nStopsRemoved = toStopIndex - fromStopIndex
  if (modification.fromStop && modification.toStop) nStopsRemoved-- // -1 because it's an exclusive interval on both sides, don't include from and to stops

  let nStopsAdded = stops.length

  // the endpoints are included, subtract them off where they overlap with existing stops
  if (modification.fromStop) nStopsAdded--
  if (modification.toStop) nStopsAdded--

  // NB using indices here so we get an object even if fromStop or toStop is null
  // stops in pattern are in fact objects but they only have stop ID.
  const fromStop = feed.stopsById[pattern.stops[fromStopIndex].stop_id]
  const toStop = feed.stopsById[pattern.stops[toStopIndex].stop_id]

  const geometry = lineSlice(
    point([fromStop.stop_lon, fromStop.stop_lat]),
    point([toStop.stop_lon, toStop.stop_lat]),
    {
      type: 'Feature',
      geometry: pattern.geometry,
      properties: {}
    }
  )

  const removedLengthThisPattern = turfLength(geometry)

  return (
    <table
      className='table table-striped'
      key={`pattern-${pattern.trips[0].trip_id}`}
    >
      <tbody>
        <tr>
          <th>{message('report.patternName')}</th>
          <td>{pattern.name}</td>
        </tr>
        <tr>
          <th>{message('report.reroute.originalLength')}</th>
          <td>
            <Distance km={patternLength} />
          </td>
        </tr>
        <tr>
          <th>{message('report.reroute.newLength')}</th>
          <td>
            <Distance
              km={patternLength - removedLengthThisPattern + segmentLength}
            />
          </td>
        </tr>
        <tr>
          <th>{message('report.reroute.segmentLength')}</th>
          <td>
            <Distance km={segmentLength} />
          </td>
        </tr>
        <tr>
          <th>{message('report.reroute.lengthDelta')}</th>
          <td>
            <Distance km={segmentLength - removedLengthThisPattern} />
          </td>
        </tr>
        <tr>
          <th>{message('modification.addedSegments.speed')}</th>
          <td>
            <Speed kmh={speed} />
          </td>
        </tr>
        <tr>
          <th>{message('modification.addedSegments.dwell')}</th>
          <td>{modification.dwell}</td>
        </tr>
        <tr>
          <th>{message('report.reroute.nStopsRemoved')}</th>
          <td>{nStopsRemoved}</td>
        </tr>
        <tr>
          <th>{message('report.reroute.nStopsAdded')}</th>
          <td>{nStopsAdded}</td>
        </tr>
      </tbody>
    </table>
  )
}
