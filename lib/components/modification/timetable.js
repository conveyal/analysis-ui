/** Represents a PatternTimetable */

import React, {PropTypes} from 'react'

import DeepEqual from '../deep-equal'
import {Text} from '../input'
import {Button} from '../buttons'
import Icon from '../icon'
import SegmentSpeeds from './segment-speeds'
import TimetableEntry from './timetable-entry'

export default class Timetable extends DeepEqual {
  static propTypes = {
    numberOfStops: PropTypes.number.isRequired,
    timetable: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    segmentDistances: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  }

  state = {
    collapsed: false
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
    const {numberOfStops, segmentDistances, timetable, update} = this.props
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
              timetable={timetable}
              update={update}
              />
            <SegmentSpeeds
              dwellTime={timetable.dwellTime}
              numberOfStops={numberOfStops}
              segmentDistances={segmentDistances}
              segmentSpeeds={timetable.segmentSpeeds}
              update={update}
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
