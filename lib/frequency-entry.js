/** Represents a single frequency entry */

import React, { PropTypes } from 'react'
import TimetableEntry from './timetable-entry'
import SelectTrip from './select-trip'
import SelectPatterns from './select-patterns'

export default class FrequencyEntry extends TimetableEntry {
  static propTypes = {
    replaceTimetable: PropTypes.func.isRequired,
    timetable: PropTypes.object.isRequired,
    feed: PropTypes.string.isRequired,
    routes: PropTypes.array.isRequired,
    trip: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.changeTrip = this.changeTrip.bind(this)
    this.selectPattern = this.selectPattern.bind(this)
  }

  changeTrip (sourceTrip) {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { sourceTrip }))
  }

  selectPattern (patternTrips) {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { patternTrips }))
  }

  render () {
    return <div>
      <SelectPatterns addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} onChange={this.selectPattern}
        feed={this.props.feed} routes={this.props.routes} trips={this.props.timetable.patternTrips}
        data={this.props.data} /><br/>

      <SelectTrip feed={this.props.feed} routes={this.props.routes} trip={this.props.timetable.sourceTrip} patternTrips={this.props.timetable.patternTrips} onChange={this.changeTrip} data={this.props.data} />

      {super.render()}
    </div>
  }
}

export function create () {
  return {
    sourceTrip: null,
    headwaySecs: 600,
    patternTrips: [],
    startTime: 7 * 3600,
    endTime: 22 * 3600,
    days: [true, true, true, true, true, true, true]
  }
}
