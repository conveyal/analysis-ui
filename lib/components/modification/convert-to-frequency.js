/**
 * Convert a route to a frequency-based representation, and adjust the frequency
 *
 * @author mattwigway
 */

import React, {PropTypes} from 'react'

import {Button} from '../buttons'
import DeepEqualComponent from '../deep-equal'
import FrequencyEntry from './frequency-entry'
import Icon from '../icon'
import {Checkbox} from '../input'
import SelectFeedAndRoutes from './select-feed-and-routes'
import {create as createFrequencyEntry} from '../../utils/frequency-entry'

export default class ConvertToFrequency extends DeepEqualComponent {
  static propTypes = {
    allPhaseFromTimetableStops: PropTypes.object.isRequired,
    feeds: PropTypes.array.isRequired,
    modification: PropTypes.object.isRequired,
    routePatterns: PropTypes.array.isRequired,
    routeStops: PropTypes.array.isRequired,
    scenarioTimetables: PropTypes.array.isRequired,
    selectedFeed: PropTypes.object,

    // actions
    setActiveTrips: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  state = {
    fullyQualifiedRouteStops: getFullyQualifiedRouteStops(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const {modification, routeStops} = this.props
    if (nextProps.routeStops !== routeStops || nextProps.modification.feed !== modification.feed) {
      this.setState({
        fullyQualifiedRouteStops: getFullyQualifiedRouteStops(nextProps)
      })
    }
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
      allPhaseFromTimetableStops,
      feeds,
      modification,
      routePatterns,
      scenarioTimetables,
      selectedFeed
    } = this.props
    const selectedRouteId = modification.routes ? modification.routes[0] : null
    return (
      <div>
        <SelectFeedAndRoutes
          feeds={feeds}
          onChange={this.onRouteChange}
          selectedFeed={selectedFeed}
          selectedRouteId={selectedRouteId}
          />

        <Checkbox
          label='Retain existing scheduled trips at times without new frequencies specified'
          onChange={this.setRetainTripsOutsideFrequencyEntries}
          checked={modification.retainTripsOutsideFrequencyEntries}
          />

        {selectedFeed && selectedRouteId && modification.entries.map((entry, eidx) => {
          return <FrequencyEntry
            allPhaseFromTimetableStops={allPhaseFromTimetableStops}
            entry={entry}
            feed={selectedFeed}
            index={eidx + 1}
            key={eidx}
            modificationStops={this.state.fullyQualifiedRouteStops}
            remove={this.removeEntry.bind(this, eidx)}
            routePatterns={routePatterns}
            routes={modification.routes}
            scenarioTimetables={scenarioTimetables}
            setActiveTrips={this.props.setActiveTrips}
            update={this.replaceEntry.bind(this, eidx)}
            />
        })}

        {selectedRouteId &&
          <Button
            block
            style='success'
            onClick={this.newEntry}
            ><Icon type='plus' /> Add frequency entry</Button>}
      </div>
    )
  }
}

const getFullyQualifiedRouteStops = ({modification, routeStops}) =>
  routeStops.map((stop) =>
    ({...stop, stop_id: `${modification.feed}:${stop.stop_id}`}))
