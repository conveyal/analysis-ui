/** display a scenario */

import React, { Component, PropTypes } from 'react'
import AddTripPattern, { create as createAddTripPattern } from './add-trip-pattern'

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
  }

  /** Create and save a new add trip pattern modification */
  newAddTripPatternModification () {
    this.props.replaceModification(createAddTripPattern())
  }

  render () {
    // sort out the various modification types
    let addTripPatterns = []

    for (let [id, m] of this.props.modifications) {
      if (m.type === 'add-trip-pattern') addTripPatterns.push(m)
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
      </div>
      )
  }
}

export default Scenario