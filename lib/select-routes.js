/** Select routes without selecting patterns */

import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {Group as FormGroup} from './components/input'

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

  selectFeed = (feed) => {
    this.props.onChange({ feed: feed && feed.value, routes: null })
  }

  selectRoute = (route) => {
    this.props.onChange({ feed: this.props.feed, routes: !route || route.value === '' ? null : [ route.value ] })
  }

  render () {
    return (
      <div>
        <FormGroup>
          <Select
            name='Feed'
            onChange={this.selectFeed}
            options={Object.keys(this.props.data.feeds).map((f) => { return { value: f, label: f } })}
            placeholder='Select feed'
            value={this.props.feed}
            />
        </FormGroup>

        {this.renderRoutes()}
      </div>
    )
  }

  renderRoutes () {
    // data not loaded
    if (!this.props.data.feeds[this.props.feed]) return []

    let routes = [...this.props.data.feeds[this.props.feed].routes.values()]
      .sort((r0, r1) => {
        let name0 = r0.route_short_name ? r0.route_short_name : r0.route_long_name
        let name1 = r1.route_short_name ? r1.route_short_name : r1.route_long_name

        // if name0 is e.g. 35 Mountain View Transit Center, parseInt will return 35, stripping the text
        let num0 = parseInt(name0, 10)
        let num1 = parseInt(name1, 10)

        if (!isNaN(num0) && !isNaN(num1)) return num0 - num1
        // numbers before letters
        else if (!isNaN(num0) && isNaN(num1)) return -1
        else if (isNaN(num0) && !isNaN(num1)) return 1

        // no numbers, sort by name
        else if (name0 < name1) return -1
        else if (name0 === name1) return 0
        else return 1
      })

    // display if the user has chosen a feed, and data for that feed has loaded
    if (this.props.feed && this.props.data.feeds[this.props.feed]) {
      return (
        <FormGroup>
          <Select
            name='Route'
            onChange={this.selectRoute}
            options={routes.map((r) => { return { value: r.route_id, label: routeLabel(r) } })}
            placeholder='Select route'
            value={this.props.routes ? this.props.routes[0] : undefined}
            />
        </FormGroup>
      )
    }
  }
}

const routeLabel = (r) => {
  return (r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')
}
