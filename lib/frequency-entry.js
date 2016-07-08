/** Represents a single frequency entry */

import React, {Component, PropTypes} from 'react'

import TimetableEntry from './timetable-entry'
import SelectTrip from './select-trip'
import SelectPatterns from './select-patterns'
import {Text} from './components/input'
import Icon from './components/icon'
import {Button} from './components/buttons'

export default class FrequencyEntry extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired,
    index: PropTypes.number,
    replaceTimetable: PropTypes.func.isRequired,
    removeTimetable: PropTypes.func.isRequired,
    setActiveTrips: PropTypes.func.isRequired,
    timetable: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    trip: PropTypes.string
  }

  changeTrip = (sourceTrip) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { sourceTrip }))
  }

  selectPattern = ({ trips }) => {
    this.props.setActiveTrips(trips)
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { patternTrips: trips, sourceTrip: trips[0] }))
  }

  changeName = (e) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { name: e.target.value }))
  }

  setActiveTrips = (e) => {
    this.props.setActiveTrips(this.props.timetable.patternTrips)
  }

  render () {
    const {feed, removeTimetable, replaceTimetable, routes, timetable} = this.props
    const routePatterns = feed && routes[0] && feed.routesById[routes[0]].patterns
    return (
      <div className='panel panel-default inner-panel' onFocus={this.setActiveTrips}>
        <div className='panel-heading clearfix'>
          <strong>{timetable.name}</strong>

          <Button
            className='pull-right'
            onClick={removeTimetable}
            size='sm'
            style='danger'
            title='Delete frequency entry'
            >
            <Icon type='close' />
          </Button>
        </div>

        <div className='panel-body'>
          <Text
            name='Name'
            onChange={this.changeName}
            value={timetable.name}
            />

          {routePatterns &&
            <SelectPatterns
              onChange={this.selectPattern}
              routePatterns={routePatterns}
              trips={timetable.patternTrips}
              />
          }

          <SelectTrip
            feed={feed}
            onChange={this.changeTrip}
            patternTrips={timetable.patternTrips}
            routes={routes}
            trip={timetable.sourceTrip}
            />

          <TimetableEntry
            replaceTimetable={replaceTimetable}
            timetable={timetable}
            />
        </div>
      </div>
    )
  }
}

export function create () {
  return {
    sourceTrip: null,
    headwaySecs: 600,
    patterns: [],
    patternTrips: [],
    startTime: 7 * 3600,
    endTime: 22 * 3600,

    // active every day
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }
}
