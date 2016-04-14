/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Checkbox, Text} from './components/input'
import Timetable, { create as createTimetable } from './timetable'

export default class AddTripPattern extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func
  };

  state = {
    editing: false
  }

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  /** edit this modification on the map */
  editOnMap = () => {
    this.props.setMapState({
      state: 'add-trip-pattern',
      modificationId: this.props.modification.id
    })
  }

  /** add a timetable */
  newTimetable = () => {
    let tt = createTimetable(this.props.modification)
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables.push(tt)
    this.props.replaceModification(mod)
  }

  /** update a timetable */
  onTimetableChange = (index, newTimetable) => {
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables[index] = newTimetable
    this.props.replaceModification(mod)
  }

  removeTimetable = (index) => {
    let timetables = [...this.props.modification.timetables]
    timetables.splice(index, 1)
    this.props.replaceModification(Object.assign({}, this.props.modification, { timetables }))
  }

  /** toggle whether a pattern is bidirectional */
  onBidirectionalChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { bidirectional: e.target.checked }))
  }

  render () {
    const {modification} = this.props
    return (
      <div>
        <Text
          name='Name'
          onChange={this.onNameChange}
          value={modification.name}
          />
        {/* TODO: hide when editing */}
        <Button
          block
          onClick={this.editOnMap}
          style='warning'
          ><Icon type='pencil' /> Edit route geometry
        </Button>
        <Checkbox
          checked={modification.bidirectional}
          label='Bidirectional'
          onChange={this.onBidirectionalChange}
          />
        {modification.timetables.map((tt, i) => {
          return <Timetable
            index={i + 1}
            key={i}
            modification={modification}
            replaceTimetable={this.onTimetableChange.bind(this, i)}
            removeTimetable={this.removeTimetable.bind(this, i)}
            timetable={tt}
            />
        })}
        <Button
          block
          onClick={this.newTimetable}
          style='success'
          ><Icon type='plus' /> Add timetable
        </Button>
      </div>
    )
  }
}

/** Create a new, blank add trip pattern modification */
export function create () {
  return {
    name: '',
    type: 'add-trip-pattern',
    id: uuid.v4(), // random uuid
    segments: [],
    timetables: [],
    expanded: true,
    showOnMap: true
  }
}
