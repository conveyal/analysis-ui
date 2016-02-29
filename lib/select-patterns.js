/** Select a (group of) patterns from the GTFS feed */

import React, { Component } from 'react'

// convenience
const GTFS_API = 'http://localhost:4567'

export default class SelectPatterns extends Component {
  constructor (props) {
    super(props)

    this.state = { routes: [] }

    fetch(`${GTFS_API}/routes?feed=${props.feed}`).then(res => res.json())
      .then(routes => this.setState(Object.assign({}, this.state, { routes })))

    // TODO add pattern support to GTFS API. We'll select routes, then patterns, then trips.
    this.selectRoute = this.selectRoute.bind(this)
  }

  selectRoute (e) {
    this.props.onChange(Object.assign({}, this.props, { routes: e.target.value === '' ? null : [ e.target.value ] }))
  }

  render () {
    return <div>
      <select value={this.props.routes[0]} onChange={this.selectRoute}>
        <option></option>
        { this.state.routes.map(r => <option value={r.route_id}>{(r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')}</option>) }
      </select>
    </div>
  }
}