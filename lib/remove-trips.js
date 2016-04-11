/** Select routes or trips to remove */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import SelectRouteAndPatterns from './select-route-and-patterns'

export default class RemoveTrips extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    data: PropTypes.object
  };

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange = (value) => {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips })
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
          onChange={this.onSelectorChange}
          routes={this.props.modification.routes}
          trips={this.props.modification.trips}
          />
      </form>
    )
  }
}

export function create (data) {
  return {
    feed: [...data.feeds.keys()][0],
    routes: null,
    trips: null,
    id: uuid.v4(),
    type: 'remove-trips',
    name: '',
    showOnMap: true,
    expanded: true
  }
}
