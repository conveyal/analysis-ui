import React, {PropTypes, PureComponent} from 'react'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import {Button} from '../buttons'
import Icon from '../icon'
import Timetable from './timetable'
import {create as createTimetable} from '../../utils/timetable'

export default class Timetables extends PureComponent {
  static propTypes = {
    allPhaseFromTimetableStops: PropTypes.object.isRequired,
    bidirectional: PropTypes.bool.isRequired,
    modificationStops: PropTypes.array.isRequired,
    numberOfStops: PropTypes.number.isRequired,
    scenarioTimetables: PropTypes.array,
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
    const {
      allPhaseFromTimetableStops,
      bidirectional,
      modificationStops,
      numberOfStops,
      scenarioTimetables,
      segmentDistances,
      timetables
    } = this.props
    return (
      <div>
        {timetables.map((tt, i) => {
          return <Timetable
            allPhaseFromTimetableStops={allPhaseFromTimetableStops}
            bidirectional={bidirectional}
            key={`timetable-${i}`}
            modificationStops={modificationStops}
            numberOfStops={numberOfStops}
            remove={this._remove.bind(this, i)}
            scenarioTimetables={scenarioTimetables}
            segmentDistances={segmentDistances}
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
