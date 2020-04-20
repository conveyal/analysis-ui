import flatMap from 'lodash/flatMap'
import React from 'react'

import Select from '../select'
import {Group as FormGroup} from '../input'

/**
 * Select a pattern, given a route and a feed
 */
export default function SelectPatterns(p) {
  function selectPatterns(selectedPatterns) {
    // convert to trip IDs as pattern IDs are not stable
    if (selectedPatterns) {
      const patterns = Array.isArray(selectedPatterns)
        ? selectedPatterns
        : [selectedPatterns]
      p.onChange({
        patterns,
        trips: flatMap(patterns, (p) => p.trips.map((t) => t.trip_id))
      })
    } else {
      p.onChange({patterns: [], trips: []})
    }
  }

  function patternsWithTrips(pattern) {
    return (
      pattern.trips.findIndex((trip) => p.trips.includes(trip.trip_id)) > -1
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
        getOptionLabel={(p) => p.name}
        getOptionValue={(p) => p.pattern_id}
        isMulti
        name='Patterns'
        onChange={selectPatterns}
        options={p.routePatterns}
        placeholder='Select patterns'
        value={patternsChecked}
      />
    </FormGroup>
  )
}
