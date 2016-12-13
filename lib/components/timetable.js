/** Represents a PatternTimetable */

import React, {Component, PropTypes} from 'react'

import {Text, Number as InputNumber} from './input'
import TimetableEntry from './timetable-entry'
import {Button} from './buttons'
import Icon from './icon'

export default class Timetable extends Component {
  static propTypes = {
    timetable: PropTypes.object.isRequired,
    removeTimetable: PropTypes.func.isRequired,
    replaceTimetable: PropTypes.func.isRequired
  }

  state = {
    collapsed: false
  }

  /** set the speed of the modification (km/h) */
  _setSpeed = (e) => {
    const timetable = Object.assign({}, this.props.timetable, { speed: Number(e.target.value) })
    this.props.replaceTimetable(timetable)
  }

  /** set the dwell time of the modification (seconds) */
  _setDwell = (e) => {
    const timetable = Object.assign({}, this.props.timetable, { dwellTime: Number(e.target.value) })
    this.props.replaceTimetable(timetable)
  }

  _changeName = (e) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { name: e.target.value }))
  }

  _removeTimetable = () => {
    if (window.confirm('Are you sure you would like to remove this timetable?')) {
      this.props.removeTimetable()
    }
  }

  _toggleCollapsed = () => {
    this.setState({
      ...this.state,
      collapsed: !this.state.collapsed
    })
  }

  render () {
    const {replaceTimetable, timetable} = this.props
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
              replaceTimetable={replaceTimetable}
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
