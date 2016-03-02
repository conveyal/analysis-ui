/** Remove stops from a route */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import SelectPatterns from './select-patterns'
import SelectStops from './select-stops'

export default class RemoveStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)

    this.onNameChange = this.onNameChange.bind(this)
    this.onPatternSelectorChange = this.onPatternSelectorChange.bind(this)
    this.onStopSelectorChange = this.onStopSelectorChange.bind(this)
  }

  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onPatternSelectorChange (value) {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips, stops: [] })
    this.props.replaceModification(modification)
  }

  onStopSelectorChange (stops) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { stops }))
  }

  render () {
    return <div>
      <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />

      <SelectPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onPatternSelectorChange}
        addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />

      {(() => {
        if (this.props.modification.routes != null) {
          return <SelectStops routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} 
             stops={this.props.modification.stops} onChange={this.onStopSelectorChange}
             addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
        } else return <span/>
      })()}
    </div>
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