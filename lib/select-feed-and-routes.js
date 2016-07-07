/** Select routes without selecting patterns */

import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {Group as FormGroup} from './components/input'

export default class SelectFeedAndRoutes extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedFeed: PropTypes.object,
    selectedRouteId: PropTypes.string
  }

  state = {
    feeds: [],
    routes: []
  }

  selectFeed = (feed) => {
    this.props.onChange({ feed: feed && feed.value, routes: null })
  }

  selectRoute = (route) => {
    this.props.onChange({ feed: this.props.selectedFeed.id, routes: !route || route.value === '' ? null : [ route.value ] })
  }

  render () {
    const {feeds, selectedFeed} = this.props
    return (
      <div>
        <FormGroup>
          <Select
            name='Feed'
            onChange={this.selectFeed}
            options={feeds.map((f) => { return { value: f.id, label: f.name } })}
            placeholder='Select feed'
            value={selectedFeed.id}
            />
        </FormGroup>

        {selectedFeed && this.renderRoutes()}
      </div>
    )
  }

  renderRoutes () {
    const {selectedFeed, selectedRouteId} = this.props
    const routes = [...selectedFeed.routes.values()].sort(routeSorter)

    return (
      <FormGroup>
        <Select
          name='Route'
          onChange={this.selectRoute}
          options={routes.map((r) => { return { value: r.route_id, label: routeLabel(r) } })}
          placeholder='Select route'
          value={selectedRouteId}
          />
      </FormGroup>
    )
  }
}

const routeLabel = (r) => {
  return (r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')
}

function routeSorter (r0, r1) {
  const name0 = r0.route_short_name ? r0.route_short_name : r0.route_long_name
  const name1 = r1.route_short_name ? r1.route_short_name : r1.route_long_name

  // if name0 is e.g. 35 Mountain View Transit Center, parseInt will return 35, stripping the text
  const num0 = parseInt(name0, 10)
  const num1 = parseInt(name1, 10)

  if (!isNaN(num0) && !isNaN(num1)) return num0 - num1
  // numbers before letters
  else if (!isNaN(num0) && isNaN(num1)) return -1
  else if (isNaN(num0) && !isNaN(num1)) return 1

  // no numbers, sort by name
  else if (name0 < name1) return -1
  else if (name0 === name1) return 0
  else return 1
}
