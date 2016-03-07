/** Select routes without selecting patterns */

import React, { Component } from 'react'

// convenience
const GTFS_API = 'http://localhost:4567'

export default class SelectRoutes extends Component {
  constructor (props) {
    super(props)
    this.selectFeed = this.selectFeed.bind(this)
    this.selectRoute = this.selectRoute.bind(this)

    this.state = { feeds: [], routes: [] }
    this.updateState(props)
  }

  updateState (props) {
    fetch(`${GTFS_API}/feeds`).then((res) => res.json())
      .then((feeds) => this.setState(Object.assign({}, this.state, { feeds })))

    if (props.feed) {
      fetch(`${GTFS_API}/routes?feed=${props.feed}`).then((res) => res.json())
        .then((routes) => this.setState(Object.assign({}, this.state, { routes })))
    }
  }

  selectFeed (e) {
    this.props.onChange({ feed: e.target.value, routes: null })
  }

  selectRoute (e) {
    this.props.onChange({ routes: e.target.value === '' ? null : [ e.target.value ] })
  }

  componentWillReceiveProps (nextProps) {
    this.updateState(nextProps)
  }

  render () {
    return <div>
      <select value={this.props.feed} onChange={this.selectFeed}>
        {this.state.feeds.map((f) => <option value={f}>{f}</option>)}
      </select><br/>

      <select value={this.props.routes ? this.props.routes[0] : undefined} onChange={this.selectRoute}>
        <option></option>
        {this.state.routes.map((r) => <option value={r.route_id}>{(r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')}</option>)}
      </select>
    </div>
  }
}
