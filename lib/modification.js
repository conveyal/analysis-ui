/** represents a single modification */

import React, { Component, PropTypes } from 'react'

import AddTripPattern from './add-trip-pattern'
import RemoveTrips from './remove-trips'
import RemoveStops from './remove-stops'
import AdjustSpeed from './adjust-speed'
import AdjustDwellTime from './adjust-dwell-time'
import ConvertToFrequency from './convert-to-frequency'
import SetPhasing from './set-phasing'
import AddStops from './add-stops'

export default class Modification extends Component {
  static propTypes = {
    replaceModification: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    deleteModification: PropTypes.func,
    setMapState: PropTypes.func.isRequired,
    modification: PropTypes.object.isRequired,
    variants: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)

    this.state = { expanded: false }

    this.delete = this.delete.bind(this)
    this.toggleExpand = this.toggleExpand.bind(this)
    this.toggleMapDisplay = this.toggleMapDisplay.bind(this)
  }

  delete () {
    this.props.deleteModification(this.props.modification.id)
  }

  toggleExpand () {
    this.props.replaceModification(Object.assign({}, this.props.modification, { expanded: !this.props.modification.expanded }))
  }

  toggleMapDisplay () {
    this.props.replaceModification(Object.assign({}, this.props.modification, { showOnMap: !this.props.modification.showOnMap }))
  }

  setVariant (variantIndex, active) {
    let variants = [...this.props.modification.variants]

    // this is coming from a bitset on the Java side so may be of varying length
    for (let i = 0; i < active; i++) {
      if (variants[i] === undefined) variants[i] = false
    }

    variants[variantIndex] = active

    this.props.replaceModification(Object.assign({}, this.props.modification, { variants }))
  }

  render () {
    if (this.props.modification.expanded) {
      let wrapped

      // convenience
      let m = this.props.modification

      if (m.type === 'add-trip-pattern') {
        wrapped = <AddTripPattern modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      } else if (m.type === 'remove-trips') {
        wrapped = <RemoveTrips modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      } else if (m.type === 'remove-stops') {
        wrapped = <RemoveStops modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      } else if (m.type === 'adjust-speed') {
        wrapped = <AdjustSpeed modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      } else if (m.type === 'adjust-dwell-time') {
        wrapped = <AdjustDwellTime modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      } else if (m.type === 'convert-to-frequency') {
        wrapped = <ConvertToFrequency modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      } else if (m.type === 'add-stops') {
        wrapped = <AddStops modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      } else if (m.type === 'set-phasing') {
        wrapped = <SetPhasing modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          setMapState={this.props.setMapState} />
      }

      return <li style={{ borderBottom: '1px solid #666' }}>
        <input type='checkbox' checked={this.props.modification.showOnMap} onChange={this.toggleMapDisplay} />
        <a onClick={this.toggleExpand} title='hide modification'>&#x25bc;</a>
        {wrapped}

        <ol class='choose-variants'>
          {this.props.variants.map((v, i) => <li key={`variant-${i}-${m.id}`}><input type='checkbox' checked={m.variants[i]} title={v} onChange={(e) => this.setVariant(i, e.target.checked)} /></li>)}
        </ol>

        <button onClick={this.delete}>Remove modification</button>
      </li>
    } else {
      return <li>
        <input type='checkbox' checked={this.props.modification.showOnMap} onChange={this.toggleMapDisplay} />
        <a onClick={this.toggleExpand} title='show modification'>&#x25b6; {this.props.modification.name}</a>
      </li>
    }
  }
}
