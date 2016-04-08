/** Represents a single frequency entry */

import React, { PropTypes } from 'react'
import TimetableEntry from './timetable-entry'
import SelectTrip from './select-trip'
import SelectPatterns from './select-patterns'
import { Text } from './components/input'

export default class FrequencyEntry extends TimetableEntry {
  static propTypes = {
    addLayer: PropTypes.func,
    data: PropTypes.object,
    index: PropTypes.number,
    replaceTimetable: PropTypes.func.isRequired,
    timetable: PropTypes.object.isRequired,
    feed: PropTypes.string.isRequired,
    removeLayer: PropTypes.func,
    routes: PropTypes.array.isRequired,
    trip: PropTypes.string
  }

  changeTrip = (sourceTrip) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { sourceTrip }))
  }

  selectPattern = (patternTrips) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { patternTrips }))
  }

  changeName = (e) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { name: e.target.value }))
  }

  render () {
    return (
      <section>
        <Text
          name='Name'
          onChange={this.changeName}
          value={this.props.timetable.name}
          />

        <SelectPatterns
          addLayer={this.props.addLayer}
          data={this.props.data}
          feed={this.props.feed}
          onChange={this.selectPattern}
          removeLayer={this.props.removeLayer}
          routes={this.props.routes}
          trips={this.props.timetable.patternTrips}
          />

        <SelectTrip
          data={this.props.data}
          feed={this.props.feed}
          onChange={this.changeTrip}
          patternTrips={this.props.timetable.patternTrips}
          routes={this.props.routes}
          trip={this.props.timetable.sourceTrip}
          />

        {super.render()}
      </section>
    )
  }
}

export function create () {
  return {
    sourceTrip: null,
    headwaySecs: 600,
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
