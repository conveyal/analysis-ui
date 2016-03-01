/** display a scenario */

import React, { Component, PropTypes } from 'react'
import AddTripPattern, { create as createAddTripPattern } from './add-trip-pattern'
import SetTripPhasing, { create as createSetTripPhasing } from './set-phasing'
import RemoveTrips, { create as createRemoveTrips } from './remove-trips'

class Scenario extends Component {
  static propTypes = {
    modifications: PropTypes.instanceOf(Map).isRequired,
    graphId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    addLayer: PropTypes.func.isRequired,
    removeLayer: PropTypes.func.isRequired,
    addControl: PropTypes.func.isRequired,
    removeControl: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    this.newAddTripPatternModification = this.newAddTripPatternModification.bind(this)
    this.newSetPhasingModification = this.newSetPhasingModification.bind(this)
    this.newRemoveTrips = this.newRemoveTrips.bind(this)
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

  render () {
    // sort out the various modification types
    let addTripPatterns = []
    let setTripPhasing = []
    let removeTrips = []

    for (let [id, m] of this.props.modifications) {
      if (m.type === 'add-trip-pattern') addTripPatterns.push(m)
      else if (m.type === 'set-trip-phasing') setTripPhasing.push(m)
      else if (m.type === 'remove-trips') removeTrips.push(m)
    }

    return (
      <div>
        <h2>Add trip patterns</h2>
        <ul>
          { addTripPatterns.map(atp =>
            <AddTripPattern modification={atp} key={atp.id} replaceModification={this.props.replaceModification}
              addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
          ) }
        </ul>
        <button onClick={this.newAddTripPatternModification}>+</button>

        <h2>Remove trips</h2>
        <ul>
          { removeTrips.map(rt => <RemoveTrips modification={rt} key={rt.id} replaceModification={this.props.replaceModification} 
              addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl}  />) }
        </ul>
        <button onClick={this.newRemoveTrips}>+</button>

        <h2>Set phasing</h2>
          <ul>
            { setTripPhasing.map(stp =>
              <SetTripPhasing modification={stp} key={stp.id} replaceModification={this.props.replaceModification} />
            )}
          </ul>
          <button onClick={this.newSetPhasingModification} />
      </div>
      )
  }
}

export default Scenario