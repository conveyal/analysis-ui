import React, {PropTypes} from 'react'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import {Button} from '../buttons'
import Icon from '../icon'
import DeepEqual from '../deep-equal'
import Timetable from './timetable'
import {create as createTimetable} from '../../utils/timetable'

export default class Timetables extends DeepEqual {
  static propTypes = {
    numberOfStops: PropTypes.number.isRequired,
    segmentDistances: PropTypes.array.isRequired,
    timetables: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  }

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
  _update = (index, newTimetableProps) => {
    const timetables = [...this.props.timetables]
    timetables[index] = {
      ...timetables[index],
      ...newTimetableProps
    }
    this.props.update({timetables})
  }

  _remove = (index) => {
    const timetables = [...this.props.timetables]
    timetables.splice(index, 1)
    this.props.update({timetables})
  }

  render () {
    const {numberOfStops, segmentDistances, timetables} = this.props
    return (
      <div>
        {timetables.map((tt, i) => {
          return <Timetable
            key={`timetable-${i}`}
            numberOfStops={numberOfStops}
            update={this._update.bind(this, i)}
            remove={this._remove.bind(this, i)}
            segmentDistances={segmentDistances}
            timetable={tt}
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
