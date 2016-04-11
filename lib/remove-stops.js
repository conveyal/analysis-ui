/** Remove stops from a route */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import {Text} from './components/input'
import SelectRouteAndPatterns from './select-route-and-patterns'
import SelectStops from './select-stops'

export default class RemoveStops extends Component {
  static propTypes = {
    data: PropTypes.object,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onPatternSelectorChange = (value) => {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips, stops: [] })
    this.props.replaceModification(modification)
  }

  render () {
    return (
      <form>
        <Text
          name='Name'
          onChange={this.onNameChange}
          value={this.props.modification.name}
          />

        <SelectRouteAndPatterns
          data={this.props.data}
          feed={this.props.modification.feed}
          onChange={this.onPatternSelectorChange}
          routes={this.props.modification.routes}
          trips={this.props.modification.trips}
          />

        {this.renderSelectStops()}
      </form>
    )
  }

  renderSelectStops () {
    if (this.props.modification.routes != null) {
      return <SelectStops
        data={this.props.data}
        modification={this.props.modification}
        replaceModification={this.props.replaceModification}
        setMapState={this.props.setMapState}
        />
    }
  }
}

export function create (data) {
  return {
    id: uuid.v4(),
    type: 'remove-stops',
    feed: [...data.feeds.keys()][0],
    routes: null,
    trips: null,
    stops: null,
    name: '',
    expanded: true,
    showOnMap: true
  }
}
