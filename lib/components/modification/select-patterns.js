import React from 'react'

import Select from '../select'
import {Group as FormGroup} from '../input'

/**
 * Select a pattern, given a route and a feed
 */
export default function SelectPatterns(p) {
  const selectPatterns = selectedPatterns => {
    // convert to trip IDs as pattern IDs are not stable
    if (selectedPatterns) {
      const patterns = selectedPatterns.map(fromOptionToValue)
      p.onChange({
        patterns,
        trips: patterns
          .map(fromIdToPattern(p.routePatterns))
          .map(toTripIds)
          .reduce(flatten, [])
      })
    } else {
      p.onChange({patterns: [], trips: []})
    }
  }

  const patternsWithTrips = pattern => {
    return (
      pattern.trips.findIndex(trip => {
        return p.trips && p.trips.indexOf(trip.trip_id) > -1
      }) > -1
    )
  }
  // if trips is null it is a glob selector for all trips on the route
  const patternsChecked =
    p.trips == null
      ? p.routePatterns
      : p.routePatterns.filter(patternsWithTrips)

  return (
    <FormGroup>
      <label htmlFor='Patterns'>Select patterns</label>
      <Select
        getOptionLabel={p => p.name}
        getOptionValue={p => p.pattern_id}
        multi
        name='Patterns'
        onChange={selectPatterns}
        options={p.routePatterns}
        placeholder='Select patterns'
        value={patternsChecked}
      />
    </FormGroup>
  )
}

const fromOptionToValue = option => option.value
const fromIdToPattern = patterns => id =>
  patterns.find(pattern => pattern.pattern_id === id)
const toTripIds = pattern =>
  pattern ? pattern.trips.map(trip => trip.trip_id) : []
const flatten = (memo, value) => memo.concat(value)
