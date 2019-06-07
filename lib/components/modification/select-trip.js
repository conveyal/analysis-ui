import React from 'react'

import {secondsToHhMmString} from 'lib/utils/time'

import Select from '../select'
import {Group as FormGroup} from '../input'

/** Select trips */
export default function SelectTrip(p) {
  const trips = React.useMemo(
    () => getTrips(p.feed, p.patternTrips, p.routes),
    [p.feed, p.patternTrips, p.routes]
  )

  return (
    <FormGroup>
      <Select
        clearable={false}
        getOptionLabel={t => tripLabel(t)}
        getOptionValue={t => t.trip_id}
        name='Trip'
        onChange={t => p.changeTrip(t.trip_id)}
        options={trips}
        placeholder='Select Trip'
        value={trips.find(t => t.trip_id === p.trip)}
      />
    </FormGroup>
  )
}

/**
 * Get all the trips in the current pattern.
 */
function getTrips(feed, patternTrips, routes) {
  const feedNotLoaded = !feed
  if (feedNotLoaded) return []

  const route = feed.routes.find(r => r.route_id === routes[0])
  const patterns = (route && route.patterns) || []

  return patterns
    .reduce(toTrips, [])
    .filter(onlyTripsInPatternTrips(patternTrips))
    .sort(byStartTime)
}

const toTrips = (trips, pattern) => [...trips, ...pattern.trips]
const onlyTripsInPatternTrips = patternTrips => trip =>
  patternTrips.indexOf(trip.trip_id) > -1
const byStartTime = (a, b) => a.start_time - b.start_time

const tripLabel = t => {
  return `${
    t.trip_short_name
      ? t.trip_short_name + ' '
      : t.trip_headsign
      ? t.trip_headsign + ' '
      : ''
  }, starting ${secondsToHhMmString(t.start_time)} (${Math.round(
    t.duration / 60
  )} minute trip)`
}
