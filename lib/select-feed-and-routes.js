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
    const value = selectedFeed ? selectedFeed.id : undefined
    return (
      <div>
        <FormGroup>
          <Select
            name='Feed'
            onChange={this.selectFeed}
            options={feeds.map((f) => { return { value: f.id, label: f.id } })}
            placeholder='Select feed'
            value={value}
            />
        </FormGroup>

        {selectedFeed && this.renderRoutes()}
      </div>
    )
  }

  renderRoutes () {
    const {selectedFeed, selectedRouteId} = this.props

    return (
      <FormGroup>
        <Select
          name='Route'
          onChange={this.selectRoute}
          options={selectedFeed.routes.map((r) => { return { value: r.route_id, label: r.label } })}
          placeholder='Select route'
          value={selectedRouteId}
          />
      </FormGroup>
    )
  }
}
