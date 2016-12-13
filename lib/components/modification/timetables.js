import React, {PropTypes} from 'react'

import {Button} from '../buttons'
import Icon from '../icon'
import DeepEqual from '../deep-equal'
import Timetable from './timetable'
import {create as createTimetable} from '../../utils/timetable'

export default class Timetables extends DeepEqual {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  }

  /** add a timetable */
  _create = () => {
    const {modification, update} = this.props
    update({
      timetables: [...modification.timetables, createTimetable(modification)]
    })
  }

  /** update a timetable */
  _update = (index, newTimetableProps) => {
    const {modification, update} = this.props
    const timetables = [...modification.timetables]
    timetables[index] = {
      ...timetables[index],
      ...newTimetableProps
    }
    update({timetables})
  }

  _remove = (index) => {
    const {modification, update} = this.props
    const timetables = [...modification.timetables]
    timetables.splice(index, 1)
    update({timetables})
  }

  render () {
    const {modification} = this.props
    return (
      <div>
        {modification.timetables.map((tt, i) => {
          return <Timetable
            key={`modification-${modification.id}-timetable-${i}`}
            update={this._update.bind(this, i)}
            remove={this._remove.bind(this, i)}
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
