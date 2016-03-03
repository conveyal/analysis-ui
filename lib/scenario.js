/** display a scenario */

import React, { Component, PropTypes } from 'react'
import AddTripPattern, { create as createAddTripPattern } from './add-trip-pattern'
import SetTripPhasing, { create as createSetTripPhasing } from './set-phasing'
import RemoveTrips, { create as createRemoveTrips } from './remove-trips'
import RemoveStops, { create as createRemoveStops } from './remove-stops'
import AdjustSpeed, { create as createAdjustSpeed } from './adjust-speed'
import AdjustDwellTime, { create as createAdjustDwellTime } from './adjust-dwell-time'

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
    this.newRemoveStops = this.newRemoveStops.bind(this)
    this.newAdjustSpeed = this.newAdjustSpeed.bind(this)
    this.newAdjustDwellTime = this.newAdjustDwellTime.bind(this)
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

  render () {
    // sort out the various modification types
    let addTripPatterns = []
    let setTripPhasing = []
    let removeTrips = []
    let removeStops = []
    let adjustSpeed = []
    let adjustDwellTime = []

    for (let [id, m] of this.props.modifications) {
      if (m.type === 'add-trip-pattern') addTripPatterns.push(m)
      else if (m.type === 'set-trip-phasing') setTripPhasing.push(m)
      else if (m.type === 'remove-trips') removeTrips.push(m)
      else if (m.type === 'remove-stops') removeStops.push(m)
      else if (m.type === 'adjust-speed') adjustSpeed.push(m)
      else if (m.type === 'adjust-dwell-time') adjustDwellTime.push(m)
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

        <h2>Remove stops</h2>
        <ul>
          { removeStops.map(rs => <RemoveStops modification={rs} key={rs.id} replaceModification={this.props.replaceModification} 
              addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />)
          }
        </ul>
        <button onClick={this.newRemoveStops}>+</button>

        <h2>Adjust speed</h2>
        <ul>
          { adjustSpeed.map(a => <AdjustSpeed modification={a} key={a.id} replaceModification={this.props.replaceModification} 
              addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />)
          }
        </ul>
        <button onClick={this.newAdjustSpeed}>+</button>

        <h2>Adjust dwell time</h2>
        <ul>
          { adjustDwellTime.map(a => <AdjustDwellTime modification={a} key={a.id} replaceModification={this.props.replaceModification} 
              addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />)
          }
        </ul>
        <button onClick={this.newAdjustDwellTime}>+</button>

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