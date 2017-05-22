// @flow
import React, {PureComponent} from 'react'

import {MAP_STATE_HIGHLIGHT_SEGMENT} from '../../constants'
import {Text} from '../input'
import {Button} from '../buttons'
import Icon from '../icon'
import SegmentSpeeds from './segment-speeds'
import TimetableEntry from './timetable-entry'

import type {Stop, Timetable} from '../../types'

type Props = {
  allPhaseFromTimetableStops: any,
  bidirectional: boolean,
  modificationStops: Stop[],
  numberOfStops: number,
  scenarioTimetables: Timetable[],
  segmentDistances: number[],
  timetable: Timetable,

  remove(): void,
  setMapState(any): void,
  update(any): void
}

type State = {
  collapsed: boolean
}

/** Represents a PatternTimetable */
export default class TimetableComponent extends PureComponent<void, Props, State> {
  state = {
    collapsed: false
  }

  _changeName = (e: Event & {currentTarget: HTMLInputElement}) => {
    const {update} = this.props
    update({name: e.currentTarget.value})
  }

  _highlightSegment = (segmentIndex: number) => {
    const {setMapState} = this.props
    setMapState({
      state: MAP_STATE_HIGHLIGHT_SEGMENT,
      segmentIndex
    })
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
    const {
      allPhaseFromTimetableStops,
      bidirectional,
      modificationStops,
      numberOfStops,
      scenarioTimetables,
      segmentDistances,
      timetable,
      update
    } = this.props
    const {collapsed} = this.state
    return (
      <section className='panel panel-default inner-panel'>
        <a
          className='panel-heading clearfix'
          onClick={this._toggleCollapsed}
          style={{cursor: 'pointer'}}
          tabIndex={0}>
          <Icon type={collapsed ? 'caret-right' : 'caret-down'} />
          <strong> {timetable.name}</strong>
        </a>

        {!collapsed &&
          <div className='panel-body'>
            <Text
              name='Name'
              onChange={this._changeName}
              value={timetable.name}
              />
            <TimetableEntry
              allPhaseFromTimetableStops={allPhaseFromTimetableStops}
              bidirectional={bidirectional}
              modificationStops={modificationStops}
              scenarioTimetables={scenarioTimetables}
              timetable={timetable}
              update={update}
              />
            <SegmentSpeeds
              dwellTime={timetable.dwellTime}
              highlightSegment={this._highlightSegment}
              numberOfStops={numberOfStops}
              segmentDistances={segmentDistances}
              segmentSpeeds={timetable.segmentSpeeds}
              update={update}
              />
            <Button
              block
              onClick={this._remove}
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
