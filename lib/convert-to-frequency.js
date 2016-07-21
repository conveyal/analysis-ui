/**
 * Convert a route to a frequency-based representation, and adjust the frequency
 *
 * @author mattwigway
 */

import React, {Component, PropTypes} from 'react'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Checkbox} from './components/input'
import SelectFeedAndRoutes from './select-feed-and-routes'
import FrequencyEntry, { create as createFrequencyEntry } from './frequency-entry'

export default class ConvertToFrequency extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setActiveTrips: PropTypes.func.isRequired
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

  setRetainTripsOutsideFrequencyEntries = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { retainTripsOutsideFrequencyEntries: e.target.checked }))
  }

  render () {
    const {feeds, feedsById, modification} = this.props
    const feed = feedsById[modification.feed]
    return (
      <div>
        <SelectFeedAndRoutes
          feeds={feeds}
          onChange={this.onRouteChange}
          selectedFeed={feedsById[modification.feed]}
          selectedRouteId={modification.routes ? modification.routes[0] : null}
          />

        <Checkbox
          label='Retain existing scheduled trips at times without new frequencies specified'
          onChange={this.setRetainTripsOutsideFrequencyEntries}
          checked={modification.retainTripsOutsideFrequencyEntries}
          />

        {feed && modification.entries.map((entry, eidx) => {
          return <FrequencyEntry
            feed={feed}
            index={eidx + 1}
            key={eidx}
            replaceTimetable={this.replaceEntry.bind(this, eidx)}
            removeTimetable={this.removeEntry.bind(this, eidx)}
            routes={modification.routes}
            setActiveTrips={this.props.setActiveTrips}
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
