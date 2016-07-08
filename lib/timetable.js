/** Represents a PatternTimetable */

import React, {Component, PropTypes} from 'react'

import {Text, Number as InputNumber} from './components/input'
import TimetableEntry from './timetable-entry'
import {Button} from './components/buttons'
import Icon from './components/icon'

export default class Timetable extends Component {
  static propTypes = {
    timetable: PropTypes.object.isRequired,
    removeTimetable: PropTypes.func.isRequired,
    replaceTimetable: PropTypes.func.isRequired
  }

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
    const {removeTimetable, replaceTimetable, timetable} = this.props
    return (
      <section className='panel panel-default inner-panel'>
        <div className='panel-heading clearfix'>
          <strong>{timetable.name}</strong>

          <Button
            className='pull-right'
            onClick={removeTimetable}
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
            value={timetable.name}
            />

          <TimetableEntry
            replaceTimetable={replaceTimetable}
            timetable={timetable}
            />
          <InputNumber
            label='Speed (km/h)'
            onChange={this.setSpeed}
            value={timetable.speed}
            />
          <InputNumber
            label='Dwell time (seconds)'
            onChange={this.setDwell}
            value={timetable.dwellTime}
            />
        </div>
      </section>
    )
  }
}
