/** Select a pattern, given routes and and a feed id */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

export default class SelectPatterns extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    feed: PropTypes.string.isRequired,
    routes: PropTypes.array.isRequired,
    trips: PropTypes.array, // trips can be null indicating a wildcard
    onChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.selectPatterns = this.selectPatterns.bind(this)

    this.id = uuid.v4()
  }

  selectPatterns (e) {
    let patterns = Array.prototype.map.call(e.target.querySelectorAll('option:checked'), (o) => o.value)
    // convert to trip IDs as pattern IDs are not stable

    let trips = []
    let allPatterns = this.props.data.feeds.get(this.props.feed).routes.get(this.props.routes[0]).patterns
    patterns.forEach((pid) => {
      let p = allPatterns.find((p) => p.pattern_id === pid)
      p.trips.forEach((t) => trips.push(t.trip_id))
    })

    this.props.onChange(trips)
  }

  render () {
    // data has not yet loaded
    if (!this.props.data.feeds.has(this.props.feed)) return <span />

    let allPatterns = this.props.data.feeds.get(this.props.feed).routes.get(this.props.routes[0]).patterns

    // data not yet loaded
    if (allPatterns === undefined) return <span />

    return <select multiple onChange={this.selectPatterns}>
      {allPatterns.map((p) => {
        // if trips is null it is a glob selector for all trips on the route
        let checked = this.props.trips == null || p.trips.findIndex((t) => { return this.props.trips.indexOf(t.trip_id) > -1 }) > -1

        return checked
          ? <option value={p.pattern_id} selected onMouseOver={this.onMouseOverPattern} onMouseOut={this.onMouseOutPattern} key={p.pattern_id}>{p.name}</option>
          : <option value={p.pattern_id} onMouseOver={this.onMouseOverPattern} onMouseOut={this.onMouseOutPattern} key={p.pattern_id}>{p.name}</option>
      })}
    </select>
  }
}
