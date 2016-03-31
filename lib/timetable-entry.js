/** Superclass for both changing frequencies and creating patterntimetables for new patterns */

import React, { Component, PropTypes } from 'react'

export default class TimetableEntry extends Component {
  static propTypes = {
    timetable: PropTypes.object,
    modification: PropTypes.object,
    onChange: PropTypes.function,
    replaceTimetable: PropTypes.func
  };

  /** set a particular day of the week as having or not having service */
  setDay = (day, value) => {
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day) === -1) {
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
        {this.renderDays()}
        <div className='form-group'>
          <label>Frequency (minutes): </label>
          <input type='text' className='form-control' value={timetable.headwaySecs / 60} onChange={this.setHeadway} />
        </div>
        <div className='form-group'>
          <label>Start time: </label>
          <input type='time' className='form-control' value={toHhMm(timetable.startTime)} onChange={this.setStartTime} />
        </div>
        <div className='form-group'>
          <label>End time: </label>
          <input type='time' className='form-control' value={toHhMm(timetable.endTime)} onChange={this.setEndTime} />
        </div>
      </div>
    )
  }

  renderDays () {
    const {timetable} = this.props
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days.map((day) => {
      const name = day.toLowerCase()
      return (
        <div className='checkbox' key={`${name}-checkbox`}>
          <label>
            <input
              type='checkbox'
              checked={timetable[name]}
              onChange={(e) => this.setDay(name, e.target.checked)}
              /> {day}
          </label>
        </div>
      )
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

