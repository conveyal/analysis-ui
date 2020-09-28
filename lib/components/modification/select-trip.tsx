import fpGet from 'lodash/fp/get'
import get from 'lodash/get'
import {useMemo} from 'react'

import {secondsToHhMmString} from 'lib/utils/time'

import ControlledSelect from '../controlled-select'

const getTripId = fpGet('trip_id')

/**
 * Trip selector.
 */
export default function SelectTrip({feed, patternTrips, routes, ...p}) {
  const trips = useMemo(() => getTrips(feed, patternTrips, routes), [
    feed,
    patternTrips,
    routes
  ])

  return (
    <ControlledSelect
      {...p}
      label='Select trip'
      getOptionLabel={tripLabel}
      getOptionValue={getTripId}
      onChange={(t) => p.onChange(getTripId(t))}
      options={trips}
      value={trips.find((t) => t.trip_id === p.trip)}
    />
  )
}

/**
 * Get all the trips in the current pattern.
 */
function getTrips(feed, patternTrips, routes) {
  const feedNotLoaded = !feed
  if (feedNotLoaded) return []

  const route = feed.routes.find((r) => r.route_id === routes[0])
  const patterns = (route && route.patterns) || []

  return patterns
    .reduce(toTrips, [])
    .filter(onlyTripsInPatternTrips(patternTrips))
    .sort(byStartTime)
}

const toTrips = (trips, pattern) => [...trips, ...pattern.trips]
const onlyTripsInPatternTrips = (patternTrips) => (trip) =>
  patternTrips.indexOf(trip.trip_id) > -1
const byStartTime = (a, b) => a.start_time - b.start_time

const tripLabel = (t) => {
  const name = get(t, 'trip_short_name') || get(t, 'trip_headsign') || ''
  const startTime = secondsToHhMmString(t.start_time)
  const duration = Math.round(t.duration / 60)
  return `${name}, starting ${startTime} (${duration} minute trip)`
}
