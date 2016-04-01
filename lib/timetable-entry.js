/** Superclass for both changing frequencies and creating patterntimetables for new patterns */

import React, { Component, PropTypes } from 'react'

import {Checkbox, Number as InputNumber} from './components/input'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const daysLowerCase = days.map((d) => d.toLowerCase())

export default class TimetableEntry extends Component {
  static propTypes = {
    timetable: PropTypes.object,
    modification: PropTypes.object,
    replaceTimetable: PropTypes.func
  };

  /** set a particular day of the week as having or not having service */
  setDay = (day, value) => {
    if (daysLowerCase.indexOf(day) === -1) {
      throw new Error(`${day} is not a day of the week`)
    }

    let timetable = Object.assign({}, this.props.timetable)
    timetable[day] = value
    this.props.replaceTimetable(timetable)
  }

  /** set the headway of the modification */
  setHeadway = (e) => {
    let timetable = Object.assign({}, this.props.timetable, { headwaySecs: Number(e.target.value) * 60 })
    this.props.replaceTimetable(timetable)
  }

  /** set the start time of this modification */
  setStartTime = (e) => {
    let timeSplit = e.target.value.split(':')
    let startTime = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60
    let timetable = Object.assign({}, this.props.timetable, { startTime })
    this.makeTimesValid(timetable)
    this.props.replaceTimetable(timetable)
  }

  /** set the end time of this modification */
  setEndTime = (e) => {
    let timeSplit = e.target.value.split(':')
    let endTime = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60
    let timetable = Object.assign({}, this.props.timetable, { endTime })
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
        <div className='form-inline'>{this.renderDays()}</div>
        <InputNumber
          label='Frequency (minutes)'
          onChange={this.setHeadway}
          value={timetable.headwaySecs / 60}
          />
        <InputNumber
          label='Start time'
          onChange={this.setStartTime}
          value={toHhMm(timetable.startTime)}
          />
        <InputNumber
          label='End time'
          onChange={this.setEndTime}
          value={toHhMm(timetable.endTime)}
          />
      </div>
    )
  }

  renderDays () {
    const {timetable} = this.props
    return days.map((day) => {
      const name = day.toLowerCase()
      return <Checkbox
        checked={timetable[name]}
        key={`${name}-checkbox`}
        label={day.slice(0, 3)}
        onChange={(e) => this.setDay(name, e.target.checked)}
        />
    })
  }
}

  /** Convert seconds since noon - 12h to HH:MM format, discarding fractional components */
export function toHhMm (secs) {
  // end time may be past midnight, move it back
  secs = secs % (60 * 60 * 24)
  let mins = secs / 60
  let hrs = Math.floor(mins / 60)
  let remainderMins = mins % 60
  return `${hrs < 10 ? '0' + hrs : hrs}:${remainderMins < 10 ? '0' + remainderMins : remainderMins}`
}

