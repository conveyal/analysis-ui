import {faPlus} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import {create as createFrequencyEntry} from 'lib/utils/frequency-entry'

import {Button} from '../buttons'
import Icon from '../icon'
import {Checkbox} from '../input'

import SelectFeedAndRoutes from './select-feed-and-routes'
import FrequencyEntry from './frequency-entry'

/**
 * Convert a route to a frequency-based representation, and adjust the frequency
 *
 * @author mattwigway
 */
export default class ConvertToFrequency extends React.Component {
  onRouteChange = ({feed, routes}) => {
    const {modification, updateAndRetrieveFeedData} = this.props
    updateAndRetrieveFeedData({
      entries: (modification.entries || []).map(entry => ({
        ...entry,
        sourceTrip: null,
        patternTrips: []
      })),
      feed,
      routes
    })
  }

  replaceEntry = index => newEntryProps => {
    const {modification, update} = this.props
    const entries = [...(modification.entries || [])]
    entries[index] = {
      ...entries[index],
      ...newEntryProps
    }
    update({entries})
  }

  removeEntry = index => () => {
    const {modification, update} = this.props
    const entries = [...(modification.entries || [])]
    entries.splice(index, 1)
    update({entries})
  }

  newEntry = () => {
    const {modification, update} = this.props
    const entries = [...(modification.entries || [])]
    entries.push(createFrequencyEntry())
    update({entries})
  }

  setRetainTripsOutsideFrequencyEntries = e => {
    this.props.update({
      retainTripsOutsideFrequencyEntries: e.currentTarget.checked
    })
  }

  render() {
    const {
      allPhaseFromTimetableStops,
      feeds,
      feedScopedModificationStops,
      modification,
      routePatterns,
      projectTimetables,
      selectedFeed
    } = this.props
    return (
      <>
        <SelectFeedAndRoutes
          feeds={feeds}
          onChange={this.onRouteChange}
          selectedFeed={selectedFeed}
          selectedRouteIds={modification.routes}
        />

        <Checkbox
          label='Retain existing scheduled trips at times without new frequencies specified'
          onChange={this.setRetainTripsOutsideFrequencyEntries}
          checked={modification.retainTripsOutsideFrequencyEntries}
        />

        {modification.routes && modification.routes.length > 0 && (
          <p>
            <Button block style='success' onClick={this.newEntry}>
              <Icon icon={faPlus} /> Add frequency entry
            </Button>
          </p>
        )}

        {selectedFeed &&
          modification.routes &&
          modification.routes.length > 0 &&
          (modification.entries || []).map((entry, eidx) => (
            <FrequencyEntry
              allPhaseFromTimetableStops={allPhaseFromTimetableStops}
              entry={entry}
              feed={selectedFeed}
              index={eidx + 1}
              key={eidx}
              modificationStops={feedScopedModificationStops}
              remove={this.removeEntry(eidx)}
              routePatterns={routePatterns}
              routes={modification.routes}
              projectTimetables={projectTimetables}
              setActiveTrips={this.props.setActiveTrips}
              update={this.replaceEntry(eidx)}
            />
          ))}
      </>
    )
  }
}
