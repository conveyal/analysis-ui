/**
 * Adjust speed on a route
 */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import SelectRouteAndPatterns from './select-route-and-patterns'

export default class AdjustSpeed extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)

    this.onNameChange = this.onNameChange.bind(this)
    this.onSelectorChange = this.onSelectorChange.bind(this)
    this.setScale = this.setScale.bind(this)
    this.newSelection = this.newSelection.bind(this)
    this.addToSelection = this.addToSelection.bind(this)
    this.removeFromSelection = this.removeFromSelection.bind(this)
    this.clearSegment = this.clearSegment.bind(this)
  }

  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange (value) {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips, hops: null })
    this.props.replaceModification(modification)
  }

  newSelection (e) {
    this.props.setMapState({
      state: 'hop-selection',
      modification: this.props.modification,
      action: 'new'
    })
  }

  addToSelection (e) {
    this.props.setMapState({
      state: 'hop-selection',
      modification: this.props.modification,
      action: 'add'
    })
  }

  removeFromSelection (e) {
    this.props.setMapState({
      state: 'hop-selection',
      modification: this.props.modification,
      action: 'remove'
    })
  }

  clearSegment (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { hops: null }))
  }

  /** set the factor by which we are scaling, or the speed which we are replacing */
  setScale (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { scale: e.target.value }))
  }

  render () {
    return <div>
      <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />
      <SelectRouteAndPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onSelectorChange} data={this.props.data} />

      {(() => {
        if (this.props.modification.routes != null) {
          return [<button onClick={this.newSelection}>Select new segment to modify</button>, ' ',
            <button onClick={this.addToSelection}>Add to segment</button>, ' ',
            <button onClick={this.removeFromSelection}>Remove from segment</button>, ' ',
            <button onClick={this.clearSegment}>Clear segment</button>]
        } else return <span/>
      })()}
      <br/>
      <label><input type='number' step='any' value={this.props.modification.scale} onChange={this.setScale} />x</label>
    </div>
  }
}

/** create a new modification */
export function create () {
  return {
    id: uuid.v4(),
    scale: 1,
    feed: null,
    routes: null,
    trips: null,
    hops: null,
    type: 'adjust-speed',
    expanded: true,
    showOnMap: true
  }
}
