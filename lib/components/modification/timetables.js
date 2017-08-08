// @flow
import React, {PureComponent} from 'react'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import {Button} from '../buttons'
import Icon from '../icon'
import TimetableComponent from './timetable'
import {create as createTimetable} from '../../utils/timetable'

import type {GTFSStop, Stop, TimetableWithModification, Timetable} from '../../types'

type Props = {
  allPhaseFromTimetableStops: any,
  bidirectional: boolean,
  modificationStops: GTFSStop[],
  qualifiedStops: Stop[],
  numberOfStops: number,
  scenarioTimetables: TimetableWithModification[],
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
  _update = (index: number, newTimetableProps: any) => {
    const timetables = [...this.props.timetables]
    timetables[index] = {
      ...timetables[index],
      ...newTimetableProps
    }
    this.props.update({timetables})
  }

  _remove = (index: number) => {
    const timetables = [...this.props.timetables]
    timetables.splice(index, 1)
    this.props.update({timetables})
  }

  render () {
    const {
      allPhaseFromTimetableStops,
      bidirectional,
      modificationStops,
      numberOfStops,
      qualifiedStops,
      scenarioTimetables,
      segmentDistances,
      setMapState,
      timetables
    } = this.props
    return (
      <div>
        {timetables.map((tt, i) => {
          return <TimetableComponent
            allPhaseFromTimetableStops={allPhaseFromTimetableStops}
            bidirectional={bidirectional}
            key={`timetable-${i}`}
            modificationStops={modificationStops}
            numberOfStops={numberOfStops}
            qualifiedStops={qualifiedStops}
            remove={this._remove.bind(this, i)}
            scenarioTimetables={scenarioTimetables}
            segmentDistances={segmentDistances}
            setMapState={setMapState}
            timetable={tt}
            update={this._update.bind(this, i)}
            />
        })}

        <Button
          block
          onClick={this._create}
          style='success'
          ><Icon type='plus' /> Add timetable
        </Button>
      </div>
    )
  }
}
