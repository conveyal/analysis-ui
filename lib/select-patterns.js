/** Select a pattern, given a route and a feed */

import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {Group as FormGroup} from './components/input'

export default class SelectPatterns extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    trips: PropTypes.array, // trips can be null indicating a wildcard
    onChange: PropTypes.func.isRequired
  }

  selectPatterns = (selectedPatterns) => {
    const {feed, onChange, route} = this.props
    // convert to trip IDs as pattern IDs are not stable
    let patterns = []
    let trips = []
    if (selectedPatterns) {
      patterns = selectedPatterns.map((p) => p.value)
      trips = patterns
        .map((pattern) => getAllPatterns({feed, route}).find((p) => p.pattern_id === pattern))
        .reduce((trips, pattern) => trips.concat(pattern.trips.map((t) => t.trip_id)), [])
    }
    onChange({ patterns, trips })
  }

  render () {
    const {feed, route, trips} = this.props
    const allPatterns = getAllPatterns({feed, route})
    // data not yet loaded
    if (allPatterns) {
      const patternsWithTrips = (p) => {
        return p.trips.findIndex((t) => { return trips.indexOf(t.trip_id) > -1 }) > -1
      }
      // if trips is null it is a glob selector for all trips on the route
      const patternsChecked = trips == null
        ? allPatterns
        : allPatterns.filter(patternsWithTrips)
      return (
        <FormGroup>
          <Select
            multi
            name='Patterns'
            onChange={this.selectPatterns}
            options={allPatterns.map((p) => { return { value: p.pattern_id, label: p.name } })}
            placeholder='Select patterns'
            value={patternsChecked.map((p) => p.pattern_id)}
            />
        </FormGroup>
      )
    }
  }
}

function getAllPatterns ({feed, route}) {
  return feed.routes.get(route).patterns
}
