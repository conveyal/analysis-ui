/** Superclass for both changing frequencies and creating patterntimetables for new patterns */

import React, {Component, PropTypes} from 'react'

import {Checkbox, Number as InputNumber, Text} from './input'
import {secondsToHhMmString} from '../utils/time'
import TimePicker from './time-picker'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAYS_LOWER_CASE = DAYS.map((d) => d.toLowerCase())

export default class TimetableEntry extends Component {
  static propTypes = {
    timetable: PropTypes.object.isRequired,
    replaceTimetable: PropTypes.func.isRequired
  }

  /** set a particular day of the week as having or not having service */
  setDay = (day, value) => {
    if (DAYS_LOWER_CASE.indexOf(day) === -1) {
      throw new Error(`${day} is not a day of the week`)
    }

    const timetable = Object.assign({}, this.props.timetable)
    timetable[day] = value
    this.props.replaceTimetable(timetable)
  }

  /** set the headway of the modification */
  setHeadway = (e) => {
    let timetable = Object.assign({}, this.props.timetable, { headwaySecs: Number(e.target.value) * 60 })
    this.props.replaceTimetable(timetable)
  }

  /** set the start time of this modification */
  setStartTime = (startTime) => {
    const timetable = Object.assign({}, this.props.timetable, { startTime })
    this.makeTimesValid(timetable)
    this.props.replaceTimetable(timetable)
  }

  /** set the end time of this modification */
  setEndTime = (endTime) => {
    const timetable = Object.assign({}, this.props.timetable, { endTime })
    this.makeTimesValid(timetable)
    this.props.replaceTimetable(timetable)
  }

  /**
   * Make sure the start time is between 00:00:00 and 23:59:59 and the end time is after the start time.
   * This makes sure that a service that runs from, say, 6PM until 1AM is properly represented.
   */
  makeTimesValid (timetable) {
    // get them both in the day
    // important to reset here, suppose end time was 11AM and start time was 12PM, but start time has been changed to 10AM; end time should no longer be next-day 11AM
    timetable.startTime = timetable.startTime % (60 * 60 * 24)
    timetable.endTime = timetable.endTime % (60 * 60 * 24)

    // cross midnight service
    if (timetable.endTime < timetable.startTime) timetable.endTime += (60 * 60 * 24)
  }

  render () {
    const {timetable} = this.props

    return (
      <div>
        <Days
          setDay={this.setDay}
          timetable={timetable}
          />
        <InputNumber
          label='Frequency (minutes)'
          onChange={this.setHeadway}
          value={timetable.headwaySecs / 60}
          />
        <TimePicker
          label='Start time'
          onChange={this.setStartTime}
          value={timetable.startTime}
          />
        <TimePicker
          label='End time'
          onChange={this.setEndTime}
          value={timetable.endTime}
          />
      </div>
    )
  }
}

const Days = ({setDay, timetable}) => {
  return (
    <div className='form-inline'>
      {DAYS.map((day) => {
        const name = day.toLowerCase()
        return <Checkbox
          checked={timetable[name]}
          key={`${name}-checkbox`}
          label={day.slice(0, 3)}
          onChange={(e) => setDay(name, e.target.checked)}
          />
      })}
    </div>
  )
}
