import Icon from '@conveyal/woonerf/components/icon'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import TimetableEntry from './timetable-entry'
import SelectTrip from './select-trip'
import SelectPatterns from './select-patterns'
import {Text} from '../input'
import {Button} from '../buttons'

/** Represents a single frequency entry */
export default class FrequencyEntry extends Component {
  static propTypes = {
    allPhaseFromTimetableStops: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    feed: PropTypes.object.isRequired,
    modificationStops: PropTypes.array.isRequired,
    routes: PropTypes.array.isRequired,
    routePatterns: PropTypes.array.isRequired,
    scenarioTimetables: PropTypes.array.isRequired,
    trip: PropTypes.string,

    // actions
    remove: PropTypes.func.isRequired,
    setActiveTrips: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  state = {
    collapsed: false
  }

  _toggleCollapsed = () => {
    this.setState({collapsed: !this.state.collapsed})
  }

  _changeTrip = sourceTrip => {
    this.props.update({sourceTrip})
  }

  _selectPattern = ({trips}) => {
    const {setActiveTrips, update} = this.props
    setActiveTrips(trips)
    update({patternTrips: trips, sourceTrip: trips[0]})
  }

  _changeName = e => {
    this.props.update({name: e.target.value})
  }

  _setActiveTrips = e => {
    const {entry, setActiveTrips} = this.props
    setActiveTrips(entry.patternTrips)
  }

  _remove = () => {
    if (
      window.confirm('Are you sure you want to remove this frequency entry?')
    ) {
      this.props.remove()
    }
  }

  render () {
    const {
      allPhaseFromTimetableStops,
      entry,
      feed,
      modificationStops,
      routePatterns,
      routes,
      scenarioTimetables,
      update
    } = this.props
    const {collapsed} = this.state
    const patternsWithTrips = routePatterns.filter(
      pattern =>
        !!pattern.trips.find(
          trip => !!entry.patternTrips.includes(trip.trip_id)
        )
    )
    const stopsInPatterns = modificationStops.filter(
      ({stop_id}) =>
        !!patternsWithTrips.find(
          pattern =>
            !!pattern.stops.find(stop => stop.stop_id === stop_id.split(':')[1])
        )
    )
    return (
      <section
        className='panel panel-default inner-panel'
        onFocus={this._setActiveTrips}
      >
        <a
          className='panel-heading clearfix'
          onClick={this._toggleCollapsed}
          style={{cursor: 'pointer'}}
          tabIndex={0}
        >
          <Icon type={collapsed ? 'caret-right' : 'caret-down'} />
          <strong>
            {' '}{entry.name}
          </strong>
        </a>

        {!collapsed &&
          <div className='panel-body'>
            <Text name='Name' onChange={this._changeName} value={entry.name} />

            {routePatterns &&
              <SelectPatterns
                onChange={this._selectPattern}
                routePatterns={routePatterns}
                trips={entry.patternTrips}
              />}

            <SelectTrip
              feed={feed}
              onChange={this._changeTrip}
              patternTrips={entry.patternTrips}
              routes={routes}
              trip={entry.sourceTrip}
            />

            <TimetableEntry
              allPhaseFromTimetableStops={allPhaseFromTimetableStops}
              modificationStops={stopsInPatterns}
              scenarioTimetables={scenarioTimetables}
              timetable={entry}
              update={update}
            />

            <Button
              block
              onClick={this._remove}
              style='danger'
              title='Delete frequency entry'
            >
              <Icon type='close' /> Delete frequency entry
            </Button>
          </div>}
      </section>
    )
  }
}
