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
    this.setSpeed = this.setSpeed.bind(this)
    this.setValue = this.setValue.bind(this)
  }


  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange (value) {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips, stops: null })
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
      <SelectRouteAndPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onSelectorChange} data={this.props.data}
        addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} selectedPatternOptions={selectedPatternOptions} />

      {(() => {
        if (this.props.modification.routes != null) {
          return <SelectStops modification={this.props.modification} nullIsWildcard data={this.props.data} setMapState={this.props.setMapState} />
        } else return <span/>
      })()}

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
    type: 'adjust-speed',
    expanded: true,
    showOnMap: true
  }
}
