/** Superclass for both changing frequencies and creating patterntimetables for new patterns */

import assert from 'assert'
import React, {Component, PropTypes} from 'react'

import {Checkbox, Number as InputNumber} from '../input'
import Phase from './phase'
import TimePicker from '../time-picker'
import messages from '../../utils/messages'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAYS_LOWER_CASE = DAYS.map((d) => d.toLowerCase())

export default class TimetableEntry extends Component {
  static propTypes = {
    allPhaseFromTimetableStops: PropTypes.object,
    bidirectional: PropTypes.bool,
    modificationStops: PropTypes.array,
    timetable: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  }

  state = {
    availableTimetables: getAvailableTimetables(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.scenarioTimetables !== this.props.scenarioTimetables) {
      this.setState({
        availableTimetables: getAvailableTimetables(nextProps)
      })
    }
  }

  /** set a particular day of the week as having or not having service */
  setDay = (day, value) => {
    assert(DAYS_LOWER_CASE.indexOf(day) !== -1, `${day} is not a day of the week`)
    const {update} = this.props
    update({[day]: value})
  }

  /** set the headway of the modification */
  setHeadway = (e) => {
    const {update} = this.props
    update({headwaySecs: Number(e.target.value) * 60})
  }

  /** set the start time of this modification */
  setStartTime = (time) => {
    const startTime = modBy24hours(time)
    const {timetable, update} = this.props
    update({
      startTime,
      endTime: add24hoursToEndIfLessThanStart(startTime, timetable.endTime)
    })
  }

  /** set the end time of this modification */
  setEndTime = (time) => {
    const endTime = modBy24hours(time)
    const {timetable, update} = this.props
    update({
      endTime: add24hoursToEndIfLessThanStart(timetable.startTime, endTime)
    })
  }

  /** Set whether this modification uses exact times */
  setExactTimes = (e) => this.props.update({ exactTimes: e.target.checked })

  render () {
    const {
      allPhaseFromTimetableStops,
      bidirectional,
      modificationStops,
      timetable,
      update
    } = this.props
    return (
      <div>
        <Days
          setDay={this.setDay}
          timetable={timetable}
          />
        <InputNumber
          label='Frequency'
          onChange={this.setHeadway}
          units='minutes'
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
        <Checkbox
          label='Times are exact'
          checked={timetable.exactTimes}
          onChange={this.setExactTimes}
          disabled={!!timetable.phaseAtStop}
          />
        {timetable.phaseAtStop &&
          <div className='alert alert-info' role='alert'>{messages.phasing.exactTimesWarning}</div>}
        <Phase
          availableTimetables={this.state.availableTimetables}
          disabled={timetable.exactTimes || bidirectional}
          modificationStops={modificationStops}
          phaseAtStop={timetable.phaseAtStop}
          phaseFromTimetable={timetable.phaseFromTimetable}
          phaseFromStop={timetable.phaseFromStop}
          phaseSeconds={timetable.phaseSeconds}
          selectedPhaseFromTimetableStops={allPhaseFromTimetableStops[timetable.phaseFromTimetable]}
          timetableHeadway={timetable.headwaySecs}
          update={update}
          />
      </div>
    )
  }
}

const modBy24hours = (time) => (time % (60 * 60 * 24))
const add24hoursToEndIfLessThanStart = (start, end) => end < start
  ? (end + (60 * 60 * 24))
  : end

function Days ({setDay, timetable}) {
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

function getAvailableTimetables (props) {
  const {scenarioTimetables, timetable} = props
  return scenarioTimetables.filter((tt) => tt.id !== timetable.id)
}
