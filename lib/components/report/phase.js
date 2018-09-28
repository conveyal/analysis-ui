// @flow
import message from '@conveyal/woonerf/message'
import React, {PureComponent} from 'react'
import {sprintf} from 'sprintf-js'

import {secondsToHhMmString} from '../../utils/time'

import type {GTFSStop, Timetable} from '../../types'
import {toString as timetableToString} from '../../utils/timetable'

type Props = {
  timetable: Timetable,
  projectTimetables: Timetable[],
  feedScopedStops: GTFSStop[]
}

/**
 * Display the phasing information for a timetable entry in the report
 */
export default class Phase extends PureComponent<void, Props, void> {
  render () {
    const {timetable, projectTimetables, feedScopedStops} = this.props
    const fromTimetable = projectTimetables.find(
      candidate =>
        timetable.phaseFromTimetable ===
        `${candidate.modificationId}:${candidate._id}`
    )

    // stop_name is from GTFS, nothing we can do about camelcase
    const atStop = feedScopedStops.find(
      stop => stop.stop_id === timetable.phaseAtStop
    )
    const fromStop = feedScopedStops.find(
      stop => stop.stop_id === timetable.phaseFromStop
    )
    const time = secondsToHhMmString(timetable.phaseSeconds)

    if (fromTimetable && atStop && fromStop) {
      const fromTimetableName = `${fromTimetable.modificationName}: ${timetableToString(fromTimetable)}`

      return (
        <div>
          {sprintf(message('report.phasing.phaseFromSeconds'), {
            time,
            timetable: fromTimetableName
          })}
          <br />
          {sprintf(message('report.phasing.phaseAtStop'), atStop.stop_name)}
          <br />
          {sprintf(message('report.phasing.phaseFromStop'), fromStop.stop_name)}
        </div>
      )
    }
  }
}
