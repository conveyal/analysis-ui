import assert from 'assert'
import React, {PureComponent} from 'react'

import message from 'lib/message'

import {Checkbox, Group} from '../input'
import MinutesSeconds from '../minutes-seconds'
import TimePicker from '../time-picker'

import Phase from './phase'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]
const DAYS_LOWER_CASE = DAYS.map(d => d.toLowerCase())

/**
 * Superclass for both changing frequencies and creating patterntimetables for
 * new patterns
 */
export default class TimetableEntry extends PureComponent {
  state = {}

  static getDerivedStateFromProps(props) {
    return {
      availableTimetables: getAvailableTimetables(props)
    }
  }

  /** set a particular day of the week as having or not having service */
  setDay = (day, value) => {
    assert(
      DAYS_LOWER_CASE.indexOf(day) !== -1,
      `${day} is not a day of the week`
    )
    const {update} = this.props
    update({[day]: value})
  }

  /** set the headway of the modification */
  setHeadway = headwaySecs => {
    this.props.update({headwaySecs})
  }

  /** set the start time of this modification */
  setStartTime = time => {
    const startTime = modBy24hours(time)
    const {timetable, update} = this.props
    update({
      startTime,
      endTime: add24hoursToEndIfLessThanStart(startTime, timetable.endTime)
    })
  }

  /** set the end time of this modification */
  setEndTime = time => {
    const endTime = modBy24hours(time)
    const {timetable, update} = this.props
    update({
      endTime: add24hoursToEndIfLessThanStart(timetable.startTime, endTime)
    })
  }

  /** Set whether this modification uses exact times */
  setExactTimes = e => this.props.update({exactTimes: e.currentTarget.checked})

  render() {
    const {
      allPhaseFromTimetableStops,
      bidirectional,
      modificationStops,
      timetable,
      update
    } = this.props
    return (
      <>
        <Days setDay={this.setDay} timetable={timetable} />
        <Group label='Frequency'>
          <MinutesSeconds
            onChange={this.setHeadway}
            seconds={timetable.headwaySecs}
          />
        </Group>
        <Group label='Start time'>
          <TimePicker
            onChange={this.setStartTime}
            value={timetable.startTime}
          />
        </Group>
        <Group label='End time'>
          <TimePicker onChange={this.setEndTime} value={timetable.endTime} />
        </Group>
        <Checkbox
          label='Times are exact'
          checked={timetable.exactTimes}
          onChange={this.setExactTimes}
          disabled={!!timetable.phaseAtStop}
        />
        {timetable.phaseAtStop && (
          <div className='alert alert-info' role='alert'>
            {message('phasing.exactTimesWarning')}
          </div>
        )}
        <Phase
          availableTimetables={this.state.availableTimetables}
          disabled={!!(timetable.exactTimes || bidirectional)}
          modificationStops={modificationStops}
          phaseAtStop={timetable.phaseAtStop}
          phaseFromTimetable={timetable.phaseFromTimetable}
          phaseFromStop={timetable.phaseFromStop}
          phaseSeconds={timetable.phaseSeconds}
          selectedPhaseFromTimetableStops={
            allPhaseFromTimetableStops[timetable.phaseFromTimetable]
          }
          timetableHeadway={timetable.headwaySecs}
          update={update}
        />
      </>
    )
  }
}

const modBy24hours = time => time % (60 * 60 * 24)
const add24hoursToEndIfLessThanStart = (start, end) =>
  end < start ? end + 60 * 60 * 24 : end

function Days({setDay, timetable}) {
  return (
    <div className='form-group'>
      <label>Days active</label>
      <div className='form-inline'>
        {DAYS.map(day => {
          const name = day.toLowerCase()
          return (
            <Checkbox
              checked={timetable[name]}
              key={`${name}-checkbox`}
              label={day.slice(0, 3)}
              onChange={e => setDay(name, e.target.checked)}
            />
          )
        })}
      </div>
    </div>
  )
}

function getAvailableTimetables(props) {
  const {projectTimetables, timetable} = props
  return projectTimetables.filter(tt => tt._id !== timetable._id)
}
