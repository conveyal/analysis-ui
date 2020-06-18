//
import message from 'lib/message'
import React, {PureComponent} from 'react'

import {secondsToHhMmString} from '../../utils/time'

import {toString as timetableToString} from '../../utils/timetable'

/**
 * Display the phasing information for a timetable entry in the report
 */
export default class Phase extends PureComponent {
  render() {
    const {timetable, projectTimetables, feedScopedStops} = this.props
    const fromTimetable = projectTimetables.find(
      (candidate) =>
        timetable.phaseFromTimetable ===
        `${candidate.modificationId}:${candidate._id}`
    )

    // stop_name is from GTFS, nothing we can do about camelcase
    const atStop = feedScopedStops.find(
      (stop) => stop.stop_id === timetable.phaseAtStop
    )
    const fromStop = feedScopedStops.find(
      (stop) => stop.stop_id === timetable.phaseFromStop
    )
    const time = secondsToHhMmString(timetable.phaseSeconds)

    if (fromTimetable && atStop && fromStop) {
      const fromTimetableName = `${
        fromTimetable.modificationName
      }: ${timetableToString(fromTimetable)}`

      return (
        <div>
          {message('report.phasing.phaseFromSeconds', {
            time,
            timetable: fromTimetableName
          })}
          <br />
          {message('report.phasing.phaseAtStop', {name: atStop.stop_name})}
          <br />
          {message('report.phasing.phaseFromStop', {name: fromStop.stop_name})}
        </div>
      )
    }
  }
}
