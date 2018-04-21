// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {PureComponent} from 'react'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import {Button} from '../buttons'
import TimetableComponent from './timetable'
import {create as createTimetable} from '../../utils/timetable'

import type {GTFSStop, Stop, Timetable} from '../../types'

type Props = {
  allPhaseFromTimetableStops: any,
  bidirectional: boolean,
  modificationStops: GTFSStop[],
  qualifiedStops: Stop[],
  numberOfStops: number,
  projectTimetables: Timetable[],
  segmentDistances: number[],
  timetables: Timetable[],

  setMapState(any): void,
  update(any): void
}

export default class Timetables extends PureComponent<void, Props, void> {
  /** add a timetable */
  _create = () => {
    const {timetables, segmentDistances, update} = this.props
    const speeds = timetables.length > 0
      ? timetables[0].segmentSpeeds
      : segmentDistances.map(() => DEFAULT_SEGMENT_SPEED)
    update({
      timetables: [...timetables, createTimetable(speeds)]
    })
  }

  /** update a timetable */
  _update = memoize((index: number) => (newTimetableProps: any) => {
    const timetables = [...this.props.timetables]
    timetables[index] = {
      ...timetables[index],
      ...newTimetableProps
    }
    this.props.update({timetables})
  })

  _remove = memoize((index: number) => () => {
    const timetables = [...this.props.timetables]
    timetables.splice(index, 1)
    this.props.update({timetables})
  })

  render () {
    const {
      allPhaseFromTimetableStops,
      bidirectional,
      modificationStops,
      numberOfStops,
      qualifiedStops,
      projectTimetables,
      segmentDistances,
      setMapState,
      timetables
    } = this.props
    return (
      <div>
        <p>
          <Button block onClick={this._create} style='success'>
            <Icon type='plus' /> Add timetable
          </Button>
        </p>
        {timetables.length === 0
          ? (
            <div className='block'>
              <div className='alert alert-danger' role='alert'>
                <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true' />
                <span className='sr-only'>Error:</span>
                At least 1 timetable must be added
              </div>
            </div>
          )
          : (
            <div className='block'>
              <div className='alert alert-info' role='alert'>
                {`${timetables.length} timetable(s)`}
              </div>
            </div>
          )
        }
        {timetables.map((tt, i) =>
          <TimetableComponent
            allPhaseFromTimetableStops={allPhaseFromTimetableStops}
            bidirectional={bidirectional}
            key={`timetable-${i}`}
            modificationStops={modificationStops}
            numberOfStops={numberOfStops}
            qualifiedStops={qualifiedStops}
            remove={this._remove(i)}
            projectTimetables={projectTimetables}
            segmentDistances={segmentDistances}
            setMapState={setMapState}
            timetable={tt}
            update={this._update(i)}
          />)}
      </div>
    )
  }
}
