/** Select a pattern, given routes and and a feed id */

import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {Group as FormGroup} from './components/input'

export default class SelectPatterns extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    feed: PropTypes.string.isRequired,
    routes: PropTypes.array.isRequired,
    trips: PropTypes.array, // trips can be null indicating a wildcard
    onChange: PropTypes.func.isRequired
  }

  selectPatterns = (selectedPatterns) => {
    // convert to trip IDs as pattern IDs are not stable
    let trips = []
    if (selectedPatterns) {
      const allPatterns = this.props.data.feeds[this.props.feed].routes.get(this.props.routes[0]).patterns
      trips = selectedPatterns
        .map((pattern) => allPatterns.find((p) => p.pattern_id === pattern.value))
        .reduce((trips, pattern) => trips.concat(pattern.trips.map((t) => t.trip_id)), [])
    }
    this.props.onChange(trips)
  }

  render () {
    // data has not yet loaded
    const feed = this.props.data.feeds[this.props.feed]
    if (feed) {
      const allPatterns = feed.routes.get(this.props.routes[0]).patterns

      // data not yet loaded
      if (allPatterns) {
        // if trips is null it is a glob selector for all trips on the route
        const patternsChecked = this.props.trips == null
          ? allPatterns
          : allPatterns.filter((p) => {
            return p.trips.findIndex((t) => { return this.props.trips.indexOf(t.trip_id) > -1 }) > -1
          })
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

    return <span />
  }
}
