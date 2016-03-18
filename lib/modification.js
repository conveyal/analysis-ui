/** represents a single modification */

import React, { Component } from 'react'

import AddTripPattern from './add-trip-pattern'
import RemoveTrips from './remove-trips'
import RemoveStops from './remove-stops'
import AdjustSpeed from './adjust-speed'
import AdjustDwellTime from './adjust-dwell-time'
import ConvertToFrequency from './convert-to-frequency'
import SetPhasing from './set-phasing'

export default class Modification extends Component {
  constructor (props) {
    super(props)

    this.state = { expanded: false }

    this.delete = this.delete.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  delete () {
    this.props.deleteModification(this.props.modification.id)
  }

  toggle () {
    this.setState(Object.assign({}, this.state, { expanded: !this.state.expanded }))
  }

  render () {
    if (this.state.expanded) {
      let wrapped

      // convenience
      let m = this.props.modification

      if (m.type === 'add-trip-pattern') {
        wrapped = <AddTripPattern modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
      } else if (m.type === 'remove-trips') {
        wrapped = <RemoveTrips modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
      } else if (m.type === 'remove-stops') {
        wrapped = <RemoveStops modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
      } else if (m.type === 'adjust-speed') {
        wrapped = <AdjustSpeed modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
      } else if (m.type === 'adjust-dwell-time') {
        wrapped = <AdjustDwellTime modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
      } else if (m.type === 'convert-to-frequency') {
        wrapped = <ConvertToFrequency modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
      } else if (m.type === 'set-phasing') {
        wrapped = <SetPhasing modification={m} key={m.id} replaceModification={this.props.replaceModification} data={this.props.data}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} addControl={this.props.addControl} removeControl={this.props.removeControl} />
      }

      return <li style={{ borderBottom: '1px solid #666' }}>
        <a onClick={this.toggle} title='hide modification'>&#x25bc;</a>
        {wrapped}
        <button onClick={this.delete}>Delete</button>
      </li>
    } else {
      return <li><a onClick={this.toggle} title='show modification'>&#x25b6; {this.props.modification.name}</a></li>
    }
  }
}
