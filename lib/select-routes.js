/** Select routes without selecting patterns */

import React, { Component, PropTypes } from 'react'

export default class SelectRoutes extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    feed: PropTypes.string,
    routes: PropTypes.array,
    onChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.selectFeed = this.selectFeed.bind(this)
    this.selectRoute = this.selectRoute.bind(this)

    this.state = { feeds: [], routes: [] }
  }

  selectFeed (e) {
    this.props.onChange({ feed: e.target.value, routes: null })
  }

  selectRoute (e) {
    this.props.onChange({ feed: this.props.feed, routes: e.target.value === '' ? null : [ e.target.value ] })
  }

  render () {
    return <div>
      <select value={this.props.feed} onChange={this.selectFeed}>
        <option></option>
        {[...this.props.data.feeds.keys()].map((f) => <option value={f} key={f}>{f}</option>)}
      </select><br/>

      {(() => {
        // display if the user has chosen a feed, and data for that feed has loaded
        if (this.props.feed && this.props.data.feeds.has(this.props.feed)) {
          return <select value={this.props.routes ? this.props.routes[0] : undefined} onChange={this.selectRoute}>
            <option></option>
            {[...this.props.data.feeds.get(this.props.feed).routes.values()].map((r) => <option value={r.route_id} key={r.route_id}>{(r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')}</option>)}
          </select>
        } else return <span/>
      })()}

    </div>
  }
}
