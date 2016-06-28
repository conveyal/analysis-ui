/** Represents a PatternTimetable */

import React, { PropTypes } from 'react'

import { Text, Number as InputNumber } from './components/input'
import TimetableEntry from './timetable-entry'
import { Button } from './components/buttons'
import Icon from './components/icon'

/** create a timetable for a modification */
export function create (modification) {
  const timetable = {
    startTime: 7 * 3600,
    endTime: 22 * 3600,
    dwellTime: 0,
    speed: 15,
    headwaySecs: 600,

    // active every day
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }

  return timetable
}

export default class Timetable extends TimetableEntry {
  static propTypes = {
    index: PropTypes.number,
    timetable: PropTypes.object,
    modification: PropTypes.object,
    replaceTimetable: PropTypes.func
  };

  /** set the speed of the modification (km/h) */
  setSpeed = (e) => {
    const timetable = Object.assign({}, this.props.timetable, { speed: Number(e.target.value) })
    this.props.replaceTimetable(timetable)
  }

  /** set the dwell time of the modification (seconds) */
  setDwell = (e) => {
    const timetable = Object.assign({}, this.props.timetable, { dwellTime: Number(e.target.value) })
    this.props.replaceTimetable(timetable)
  }

  changeName = (e) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { name: e.target.value }))
  }

  render () {
    return (
      <section className='panel panel-default inner-panel'>
        <div className='panel-heading clearfix'>
          <strong>{this.props.timetable.name}</strong>

          <Button
            className='pull-right'
            onClick={this.props.removeTimetable}
            size='sm'
            style='danger'
            title='Delete timetable'
            >
            <Icon type='close' />
          </Button>
        </div>

        <div className='panel-body'>
          <Text
            name='Name'
            onChange={this.changeName}
            value={this.props.timetable.name}
            />
          {super.render()}
          <InputNumber
            label='Speed (km/h)'
            onChange={this.setSpeed}
            value={this.props.timetable.speed}
            />
          <InputNumber
            label='Dwell time (seconds)'
            onChange={this.setDwell}
            value={this.props.timetable.dwellTime}
            />
        </div>
      </section>
    )
  }
}
