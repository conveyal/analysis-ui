/** Remove stops from a route */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

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
        <div className='form-group'>
          <input type='text' className='form-control' placeholder='Name' value={this.props.modification.name} onChange={this.onNameChange} />
        </div>

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

export function create () {
  return {
    id: uuid.v4(),
    type: 'remove-stops',
    feed: null,
    routes: null,
    trips: null,
    stops: null,
    name: ''
  }
}
