/**
 * Convert a route to a frequency-based representation, and adjust the frequency
 *
 * This is more destructive than the other modifications. All service on the selected patterns will be removed,
 * and replaced with frequencies. NB if there are a lot of short turns, you must also create a remove-trips modification
 * to get rid of the other patterns.
 *
 * @author mattwigway
 */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Text} from './components/input'
import SelectRoutes from './select-routes'
import FrequencyEntry, { create as createFrequencyEntry } from './frequency-entry'

export default class ConvertToFrequency extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  onRouteChange = ({ feed, routes }) => {
    let modification = Object.assign({}, this.props.modification, { feed, routes })
    modification.entries = modification.entries.map((m) => Object.assign({}, m, { sourceTrip: null, patternTrips: [] }))
    this.props.replaceModification(modification)
  }

  replaceEntry = (index, entry) => {
    let entries = [...this.props.modification.entries]
    entries[index] = entry
    this.props.replaceModification(Object.assign({}, this.props.modification, { entries }))
  }

  removeEntry = (index) => {
    let entries = [...this.props.modification.entries]
    entries.splice(index, 1)
    this.props.replaceModification(Object.assign({}, this.props.modification, { entries }))
  }

  newEntry = (e) => {
    let entries = [...this.props.modification.entries]
    entries.push(createFrequencyEntry())
    this.props.replaceModification(Object.assign({}, this.props.modification, { entries }))
  }

  setName = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  render () {
    const {modification} = this.props
    return (
      <div>
        <Text
          name='Name'
          onChange={this.setName}
          value={modification.name}
          />

        <SelectRoutes
          data={this.props.data}
          feed={modification.feed}
          onChange={this.onRouteChange}
          routes={modification.routes}
          />

        {modification.entries.map((entry, eidx) => {
          return <FrequencyEntry
            data={this.props.data}
            feed={modification.feed}
            index={eidx + 1}
            key={eidx}
            replaceTimetable={this.replaceEntry.bind(this, eidx)}
            removeTimetable={this.removeEntry.bind(this, eidx)}
            routes={modification.routes}
            timetable={entry}
            />
        })}

        <Button
          block
          style='success'
          onClick={this.newEntry}
          ><Icon type='plus' /> Add frequency entry</Button>
      </div>
    )
  }
}

export function create (data) {
  return {
    id: uuid.v4(),
    feed: [...data.feeds.keys()][0],
    routes: null,
    name: '',
    entries: [],
    type: 'convert-to-frequency',
    expanded: true,
    showOnMap: true
  }
}
