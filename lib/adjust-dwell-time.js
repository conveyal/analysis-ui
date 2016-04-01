/** Change dwell times */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import {Number as InputNumber, Text} from './components/input'
import SelectRouteAndPatterns from './select-route-and-patterns'
import SelectStops from './select-stops'

export default class AdjustDwellTime extends Component {
  static propTypes = {
    addControl: PropTypes.func,
    addLayer: PropTypes.func,
    data: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    removeControl: PropTypes.func,
    removeLayer: PropTypes.func,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func
  }

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onPatternSelectorChange = (value) => {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips, stops: null })
    this.props.replaceModification(modification)
  }

  onStopSelectorChange = (stops) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { stops }))
  }

  /** we are setting a scale for existing speeds, not an actual speed */
  setScale = (e) => {
    if (e.target.checked) this.props.replaceModification(Object.assign({}, this.props.modification, { scale: true }))
  }

  /** we are setting a brand-new speed, throwing out any existing variation in speed */
  setSpeed = (e) => {
    if (e.target.checked) this.props.replaceModification(Object.assign({}, this.props.modification, { scale: false }))
  }

  /** set the factor by which we are scaling, or the speed which we are replacing */
  setValue = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { value: e.target.value }))
  }

  render () {
    const {modification} = this.props
    return (
      <div>
        <Text
          name='Name'
          onChange={this.onNameChange}
          value={modification.name}
          />

        <SelectRouteAndPatterns
          addControl={this.props.addControl}
          addLayer={this.props.addLayer}
          data={this.props.data}
          feed={modification.feed}
          onChange={this.onPatternSelectorChange}
          removeControl={this.props.removeControl}
          removeLayer={this.props.removeLayer}
          routes={modification.routes}
          trips={modification.trips}
          />

        {this.renderSelectStops()}
        <br />

        <div className='form-group'>
          <label className='radio-inline'><input type='radio' value='scale' checked={this.props.modification.scale} onChange={this.setScale} />Scale existing dwell times by</label>
          <label className='radio-inline'><input type='radio' value='speed' checked={!this.props.modification.scale} onChange={this.setSpeed} />Set new dwell time to</label>
        </div>

        <InputNumber
          onChange={this.setValue}
          value={modification.value}
          />
      </div>
    )
  }

  renderSelectStops () {
    if (this.props.modification.routes != null) {
      return <SelectStops
        data={this.props.data}
        modification={this.props.modification}
        nullIsWildcard
        onChange={this.onStopSelectorChange}
        replaceModification={this.props.replaceModification}
        setMapState={this.props.setMapState}
        />
    }
  }
}

export function create () {
  return {
    id: uuid.v4(),
    type: 'adjust-dwell-time',
    feed: null,
    routes: null,
    trips: null,
    stops: null,
    value: 30,
    scale: false,
    name: '',
    expanded: true,
    showOnMap: true
  }
}
