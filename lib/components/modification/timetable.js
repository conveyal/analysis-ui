/** Represents a PatternTimetable */

import React, {PropTypes} from 'react'

import DeepEqual from '../deep-equal'
import {Text, Number as InputNumber} from '../input'
import {Button} from '../buttons'
import Icon from '../icon'

import TimetableEntry from './timetable-entry'

export default class Timetable extends DeepEqual {
  static propTypes = {
    timetable: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  state = {
    collapsed: false
  }

  /** set the speed of the modification (km/h) */
  _setSpeed = (e) => {
    const {update} = this.props
    update({speed: Number(e.target.value)})
  }

  /** set the dwell time of the modification (seconds) */
  _setDwell = (e) => {
    const {update} = this.props
    update({dwellTime: Number(e.target.value)})
  }

  _changeName = (e) => {
    const {update} = this.props
    update({name: e.target.value})
  }

  _remove = () => {
    if (window.confirm('Are you sure you would like to remove this timetable?')) {
      this.props.remove()
    }
  }

  _toggleCollapsed = () => {
    this.setState({
      ...this.state,
      collapsed: !this.state.collapsed
    })
  }

  render () {
    const {timetable, update} = this.props
    const {collapsed} = this.state
    return (
      <section className='panel panel-default inner-panel'>
        <div
          className='panel-heading clearfix'
          onClick={this._toggleCollapsed}
          style={{cursor: 'pointer'}}>
          <Icon type={collapsed ? 'chevron-right' : 'chevron-down'} />
          <strong> {timetable.name}</strong>
        </div>

        {!collapsed &&
          <div className='panel-body'>
            <Text
              name='Name'
              onChange={this._changeName}
              value={timetable.name}
              />
            <TimetableEntry
              update={update}
              timetable={timetable}
              />
            <InputNumber
              label='Speed (km/h)'
              onChange={this._setSpeed}
              value={timetable.speed}
              />
            <InputNumber
              label='Dwell time (seconds)'
              onChange={this._setDwell}
              value={timetable.dwellTime}
              />
            <InputNumber
              label='Travel time (mins)'
              onChange={this._setSpeedFromTravelTime}
              value={0}
              />
            <Button
              block
              onClick={this._removeTimetable}
              style='danger'
              title='Delete timetable'
              >
              <Icon type='close' /> Delete Timetable
            </Button>
          </div>
        }
      </section>
    )
  }
}
