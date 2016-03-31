/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

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
      modification: this.props.modification
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

  /** toggle whether a pattern is bidirectional */
  onBidirectionalChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { bidirectional: e.target.checked }))
  }

  render () {
    return (
      <div>
        <div>
          <div className='form-group'>
            <input className='form-control' type='text' placeholder='Name' value={this.props.modification.name} onChange={this.onNameChange} />
          </div>
          {/* TODO: hide when editing */}
          <button className='btn btn-sm btn-block btn-warning' onClick={this.editOnMap}><i className='fa fa-pencil'></i> Edit route geometry</button>
          <div className='checkbox'>
            <label><input type='checkbox' checked={this.props.modification.bidirectional} onChange={this.onBidirectionalChange} /> Bidirectional</label>
          </div>
        </div>
        <div>
          {this.props.modification.timetables.map((tt, i) => {
            return <Timetable
              index={i + 1}
              key={i}
              modification={this.props.modification}
              replaceTimetable={this.onTimetableChange.bind(this, i)}
              timetable={tt}
              />
          })}
          <button className='btn btn-sm btn-block btn-success' onClick={this.newTimetable}><i className='fa fa-plus'></i> Add timetable</button>
        </div>
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
    geometry: { type: 'LineString', coordinates: [] },
    controlPoints: [],
    stops: [],
    stopIds: [],
    timetables: [],
    expanded: true,
    showOnMap: true
  }
}
