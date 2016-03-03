/**
 * Adjust speed on a route
 */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import SelectPatterns from './select-patterns'
import colors from './colors'

const selectedPatternOptions = {
  style: {
    color: colors.MODIFIED,
    weight: 3
  }
}

export default class AdjustSpeed extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this.onNameChange = this.onNameChange.bind(this)
    this.onSelectorChange = this.onSelectorChange.bind(this)
    this.setScale = this.setScale.bind(this)
    this.setSpeed = this.setSpeed.bind(this)
    this.setValue = this.setValue.bind(this)
  }


  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange (value) {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips })
    this.props.replaceModification(modification)
  }

  /** we are setting a scale for existing speeds, not an actual speed */
  setScale (e) {
    if (e.target.checked) this.props.replaceModification(Object.assign({}, this.props.modification, { scale: true }))
  }

  /** we are setting a brand-new speed, throwing out any existing variation in speed */
  setSpeed (e) {
    if (e.target.checked) this.props.replaceModification(Object.assign({}, this.props.modification, { scale: false }))
  }

  /** set the factor by which we are scaling, or the speed which we are replacing */
  setValue (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { value: e.target.value }))
  }

  render () {
    return <div>
      <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />
      <SelectPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onSelectorChange}
        addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} selectedPatternOptions={selectedPatternOptions}  />

      <label><input type='radio' value='scale' checked={this.props.modification.scale} onChange={this.setScale} />Scale existing speeds by</label>
      <label><input type='radio' value='speed' checked={!this.props.modification.scale} onChange={this.setSpeed} />Set new speed to</label>

      <label><input type='number' step='any' value={this.props.modification.value} onChange={this.setValue} />{ this.props.modification.scale ? 'x (higher is faster)' : 'km/h' }</label>
    </div>
  }
}

/** create a new modification */
export function create () {
  return {
    id: uuid.v4(),
    scale: true,
    value: 1,
    feed: null,
    routes: null,
    trips: null,
    type: 'adjust-speed'
  }
}
