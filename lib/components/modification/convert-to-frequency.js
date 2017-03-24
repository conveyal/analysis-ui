/**
 * Convert a route to a frequency-based representation, and adjust the frequency
 *
 * @author mattwigway
 */

import React, {PropTypes} from 'react'

import {Button} from '../buttons'
import DeepEqualComponent from '../deep-equal'
import Icon from '../icon'
import {Checkbox} from '../input'
import SelectFeedAndRoutes from './select-feed-and-routes'
import FrequencyEntry from './frequency-entry'
import {create as createFrequencyEntry} from '../../utils/frequency-entry'

export default class ConvertToFrequency extends DeepEqualComponent {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    modification: PropTypes.object.isRequired,
    routePatterns: PropTypes.array.isRequired,
    selectedFeed: PropTypes.object,
    setActiveTrips: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  onRouteChange = ({feed, routes}) => {
    const {modification, update} = this.props
    update({
      entries: modification.entries.map((entry) => ({...entry, sourceTrip: null, patternTrips: []})),
      feed,
      routes
    })
  }

  replaceEntry = (index, newEntryProps) => {
    const {modification, update} = this.props
    const entries = [...modification.entries]
    entries[index] = {
      ...entries[index],
      ...newEntryProps
    }
    update({entries})
  }

  removeEntry = (index) => {
    const {modification, update} = this.props
    const entries = [...modification.entries]
    entries.splice(index, 1)
    update({entries})
  }

  newEntry = (e) => {
    const {modification, update} = this.props
    const entries = [...modification.entries]
    entries.push(createFrequencyEntry())
    update({entries})
  }

  setRetainTripsOutsideFrequencyEntries = (e) => {
    this.props.update({retainTripsOutsideFrequencyEntries: e.target.checked})
  }

  render () {
    const {
      feeds,
      modification,
      routePatterns,
      selectedFeed
    } = this.props
    return (
      <div>
        <SelectFeedAndRoutes
          feeds={feeds}
          onChange={this.onRouteChange}
          selectedFeed={selectedFeed}
          selectedRouteId={modification.routes ? modification.routes[0] : null}
          />

        <Checkbox
          label='Retain existing scheduled trips at times without new frequencies specified'
          onChange={this.setRetainTripsOutsideFrequencyEntries}
          checked={modification.retainTripsOutsideFrequencyEntries}
          />

        {selectedFeed && modification.entries.map((entry, eidx) => {
          return <FrequencyEntry
            feed={selectedFeed}
            index={eidx + 1}
            key={eidx}
            update={this.replaceEntry.bind(this, eidx)}
            remove={this.removeEntry.bind(this, eidx)}
            routePatterns={routePatterns}
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
