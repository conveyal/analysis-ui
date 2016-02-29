/** Select routes or trips to remove */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import SelectPatterns from './select-patterns'

export default class RemoveTrips extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this.onNameChange = this.onNameChange.bind(this)
    this.onSelectorChange = this.onSelectorChange.bind(this)
  }


  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange (value) {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips })
    this.props.replaceModification(modification)
  }

  render () {
    return <div>
      <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />
      <SelectPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onSelectorChange} />
    </div>
  }
}

export function create () {
  return {
    // TODO don't hardwire
    feed: 'kcata',
    routes: null,
    trips: null,
    id: uuid.v4(),
    type: 'remove-trips',
    name: ''
  }
}