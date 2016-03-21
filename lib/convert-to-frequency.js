/**
 * Convert a route to a frequency-based representation, and adjust the frequency
 *
 * This is more destructive than the other modifications. All service on the selected patterns will be removed,
 * and replaced with frequencies. NB if there are a lot of short turns, you must also create a remove-trips modification
 * to get rid of the other patterns.
 *
 * @author mattwigway
 */

import React, { Component } from 'react'
import SelectRoutes from './select-routes'
import FrequencyEntry, { create as createFrequencyEntry } from './frequency-entry'
import uuid from 'uuid'

export default class ConvertToFrequency extends Component {
  constructor (props) {
    super(props)

    this.onRouteChange = this.onRouteChange.bind(this)
    this.replaceEntry = this.replaceEntry.bind(this)
    this.newEntry = this.newEntry.bind(this)
    this.setName = this.setName.bind(this)
  }

  onRouteChange ({ feed, routes }) {
    let modification = Object.assign({}, this.props.modification, { feed, routes })
    modification.entries = modification.entries.map((m) => Object.assign({}, m, { sourceTrip: null, patternTrips: [] }))
    this.props.replaceModification(modification)
  }

  replaceEntry (index, entry) {
    let entries = [...this.props.modification.entries]
    entries[index] = entry
    this.props.replaceModification(Object.assign({}, this.props.modification, { entries }))
  }

  newEntry (e) {
    let entries = [...this.props.modification.entries]
    entries.push(createFrequencyEntry())
    this.props.replaceModification(Object.assign({}, this.props.modification, { entries }))
  }

  setName (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  render () {
    return <div>
      <input type='text' value={this.props.modification.name} onChange={this.setName} /><br/>

      <SelectRoutes feed={this.props.modification.feed} routes={this.props.modification.routes} onChange={this.onRouteChange} data={this.props.data} />

      {this.props.modification.entries.map((entry, eidx) => {
        return <FrequencyEntry feed={this.props.modification.feed} routes={this.props.modification.routes}
          addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} key={eidx} data={this.props.data}
          timetable={entry} replaceTimetable={this.replaceEntry.bind(this, eidx)} />
      })}

      <button onClick={this.newEntry}>Add frequency entry</button>
    </div>
  }
}

export function create () {
  return {
    id: uuid.v4(),
    feed: null,
    routes: null,
    name: '',
    entries: [],
    type: 'convert-to-frequency',
    expanded: true,
    showOnMap: true
  }
}
