/** Select a (group of) patterns from the GTFS feed */

import React, { Component } from 'react'

// convenience
const GTFS_API = 'http://localhost:4567'

export default class SelectPatterns extends Component {
  constructor (props) {
    super(props)

    this.state = { routes: [] }

    this.updateState(props)

    this.selectRoute = this.selectRoute.bind(this)
    this.selectPatterns = this.selectPatterns.bind(this)
  }

  updateState (props) {
    fetch(`${GTFS_API}/routes?feed=${props.feed}`).then(res => res.json())
      .then(routes => this.setState(Object.assign({}, this.state, { routes })))

    // if a single route is selected, fetch patterns
    if (props.routes && props.routes.length === 1) {
      fetch(`${GTFS_API}/patterns?feed=${props.feed}&route=${props.routes[0]}`).then(res => res.json())
        .then(patterns => this.setState(Object.assign({}, this.state, { patterns })))
    }
  }

  componentWillReceiveProps (nextProps) {
    this.updateState(nextProps)
  }

  selectRoute (e) {
    this.props.onChange(Object.assign({}, this.props, { routes: e.target.value === '' ? null : [ e.target.value ], trips: null }))
  }

  selectPatterns (e) {
    let patterns = Array.prototype.map.call(e.target.querySelectorAll('option:checked'), o => o.value)
    // convert to trip IDs as pattern IDs are not stable

    let trips = []
    patterns.forEach(pid => {
      let p = this.state.patterns.find(p => p.pattern_id === pid)
      p.trips.forEach(t => trips.push(t))
    })

    this.props.onChange(Object.assign({}, this.props, { trips }))
  }

  render () {
    return <div>
      <select value={this.props.routes ? this.props.routes[0] : undefined} onChange={this.selectRoute}>
        <option></option>
        { this.state.routes.map(r => <option value={r.route_id}>{(r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')}</option>) }
      </select>

      {(() => {
        if (this.props.routes && this.props.routes.length === 1 && this.state.patterns) {
          return <select multiple onChange={this.selectPatterns}>
            {this.state.patterns.map(p => {
              // if trips is null it is a glob selector for all trips on the route
              let checked = this.props.trips == null || p.trips.find(t => this.props.trips.indexOf(t) > -1) != null

              return checked ? <option value={p.pattern_id} selected>{p.name}</option> : <option value={p.pattern_id}>{p.name}</option>
            })}
          </select>
        } else return <span/>
      })()}
    </div>
  }
}