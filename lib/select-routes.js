/** Select routes without selecting patterns */

import React, { Component, PropTypes } from 'react'

import {Select} from './components/input'

export default class SelectRoutes extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    feed: PropTypes.string,
    routes: PropTypes.array,
    onChange: PropTypes.func.isRequired
  }

  state = {
    feeds: [],
    routes: []
  }

  selectFeed = (e) => {
    this.props.onChange({ feed: e.target.value, routes: null })
  }

  selectRoute = (e) => {
    this.props.onChange({ feed: this.props.feed, routes: e.target.value === '' ? null : [ e.target.value ] })
  }

  render () {
    return (
      <div>
        <Select
          label='Feed'
          onChange={this.selectFeed}
          value={this.props.feed}
          >
          <option></option>
          {[...this.props.data.feeds.keys()].map((f) => <option value={f} key={f}>{f}</option>)}
        </Select>

        {this.renderRoutes()}
      </div>
    )
  }

  renderRoutes () {
    // display if the user has chosen a feed, and data for that feed has loaded
    if (this.props.feed && this.props.data.feeds.has(this.props.feed)) {
      return (
        <Select
          label='Route'
          onChange={this.selectRoute}
          value={this.props.routes ? this.props.routes[0] : undefined}
          >
          <option></option>
          {[...this.props.data.feeds.get(this.props.feed).routes.values()].map((r) => <option value={r.route_id} key={r.route_id}>{(r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')}</option>)}
        </Select>
      )
    }
  }
}
