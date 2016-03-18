/** display a scenario */

import React, { Component, PropTypes } from 'react'
import { create as createAddTripPattern } from './add-trip-pattern'
import { create as createSetTripPhasing } from './set-phasing'
import { create as createRemoveTrips } from './remove-trips'
import { create as createRemoveStops } from './remove-stops'
import { create as createAdjustSpeed } from './adjust-speed'
import { create as createAdjustDwellTime } from './adjust-dwell-time'
import { create as createConvertToFrequency } from './convert-to-frequency'
import Modification from './modification'

class Scenario extends Component {
  static propTypes = {
    modifications: PropTypes.instanceOf(Map).isRequired,
    bundleId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    addLayer: PropTypes.func.isRequired,
    removeLayer: PropTypes.func.isRequired,
    addControl: PropTypes.func.isRequired,
    removeControl: PropTypes.func.isRequired,
    data: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.newAddTripPatternModification = this.newAddTripPatternModification.bind(this)
    this.newSetPhasingModification = this.newSetPhasingModification.bind(this)
    this.newRemoveTrips = this.newRemoveTrips.bind(this)
    this.newRemoveStops = this.newRemoveStops.bind(this)
    this.newAdjustSpeed = this.newAdjustSpeed.bind(this)
    this.newAdjustDwellTime = this.newAdjustDwellTime.bind(this)
    this.newConvertToFrequency = this.newConvertToFrequency.bind(this)
  }

  /** Create and save a new add trip pattern modification */
  newAddTripPatternModification () {
    this.props.replaceModification(createAddTripPattern())
  }

  /** Create and save a new Set Phasing modification */
  newSetPhasingModification () {
    this.props.replaceModification(createSetTripPhasing())
  }

  /** create and save a new remove trips modification */
  newRemoveTrips () {
    this.props.replaceModification(createRemoveTrips())
  }

  /** create and save a new remove stops modification */
  newRemoveStops () {
    this.props.replaceModification(createRemoveStops())
  }

  /** create and save a new adjust speed modification */
  newAdjustSpeed () {
    this.props.replaceModification(createAdjustSpeed())
  }

  /** create and save a new adjust dwell time modification */
  newAdjustDwellTime () {
    this.props.replaceModification(createAdjustDwellTime())
  }

  /** create and save a new convert to frequency modification */
  newConvertToFrequency () {
    this.props.replaceModification(createConvertToFrequency())
  }

  createModifications (mods) {
    return <ul>
      {mods.map(mod => <Modification modification={mod} key={mod.id} replaceModification={this.props.replaceModification} deleteModification={this.props.deleteModification}
        addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} data={this.props.data} />)}
    </ul>
  }

  render () {
    // sort out the various modification types
    let addTripPatterns = []
    let setTripPhasing = []
    let removeTrips = []
    let removeStops = []
    let adjustSpeed = []
    let adjustDwellTime = []
    let convertToFrequency = []

    for (let [id, m] of this.props.modifications) {
      if (m.type === 'add-trip-pattern') addTripPatterns.push(m)
      else if (m.type === 'set-trip-phasing') setTripPhasing.push(m)
      else if (m.type === 'remove-trips') removeTrips.push(m)
      else if (m.type === 'remove-stops') removeStops.push(m)
      else if (m.type === 'adjust-speed') adjustSpeed.push(m)
      else if (m.type === 'adjust-dwell-time') adjustDwellTime.push(m)
      else if (m.type === 'convert-to-frequency') convertToFrequency.push(m)
    }

    return (
      <div>
        <h2>Add trip patterns</h2>
        {this.createModifications(addTripPatterns)}
        <button onClick={this.newAddTripPatternModification}>+</button>

        <h2>Remove trips</h2>
        {this.createModifications(removeTrips)}
        <button onClick={this.newRemoveTrips}>+</button>

        <h2>Remove stops</h2>
        {this.createModifications(removeStops)}
        <button onClick={this.newRemoveStops}>+</button>

        <h2>Adjust speed</h2>
        {this.createModifications(adjustSpeed)}
        <button onClick={this.newAdjustSpeed}>+</button>

        <h2>Adjust dwell time</h2>
        {this.createModifications(adjustDwellTime)}
        <button onClick={this.newAdjustDwellTime}>+</button>

        <h2>Change frequency</h2>
        {this.createModifications(convertToFrequency)}
        <button onClick={this.newConvertToFrequency}>+</button>

        <h2>Set phasing</h2>
        {this.createModifications(setTripPhasing)}
        <button onClick={this.newSetPhasingModification}>+</button>
      </div>
      )
  }
}

export default Scenario
