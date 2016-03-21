/** Select routes or trips to remove */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import SelectRouteAndPatterns from './select-route-and-patterns'
import colors from './colors'

 /** The style of deleted patterns on the map */
const deletedPatternOptions = {
  style: {
    color: colors.REMOVED,
    weight: 3
  }
}

export default class RemoveTrips extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    data: PropTypes.object
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
      <SelectRouteAndPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onSelectorChange} data={this.props.data}
        addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} selectedPatternOptions={deletedPatternOptions}/>
      }
    </div>
  }
}

export function create () {
  return {
    feed: null,
    routes: null,
    trips: null,
    id: uuid.v4(),
    type: 'remove-trips',
    name: '',
    showOnMap: true,
    expanded: true
  }
}
