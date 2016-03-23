/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import Timetable, { create as createTimetable } from './timetable'

export default class AddTripPattern extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    this.onNameChange = this.onNameChange.bind(this)
    this.editOnMap = this.editOnMap.bind(this)
    this.newTimetable = this.newTimetable.bind(this)
    this.onTimetableChange = this.onTimetableChange.bind(this)
    this.onBidirectionalChange = this.onBidirectionalChange.bind(this)
    this.state = { editing: false }
  }

  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  /** edit this modification on the map */
  editOnMap () {
    this.props.setMapState({
      state: 'add-trip-pattern',
      modification: this.props.modification
    })
  }

  /** add a timetable */
  newTimetable () {
    let tt = createTimetable(this.props.modification)
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables.push(tt)
    this.props.replaceModification(mod)
  }

  /** update a timetable */
  onTimetableChange (index, newTimetable) {
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables[index] = newTimetable
    this.props.replaceModification(mod)
  }

  /** toggle whether a pattern is bidirectional */
  onBidirectionalChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { bidirectional: e.target.checked }))
  }

  render () {
    return (
      <div>
        <div>
          <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />
          {/* TODO: hide when editing */}
          <a href='#' onClick={this.editOnMap}>edit route geometry</a><br/>
          <label>bidirectional <input type='checkbox' checked={this.props.modification.bidirectional} onChange={this.onBidirectionalChange} /></label>
        </div>
        <div>
          { this.props.modification.timetables.map((tt, i) => <Timetable timetable={tt} key={i} modification={this.props.modification} replaceTimetable={this.onTimetableChange.bind(this, i)} />) }
          <button onClick={this.newTimetable}>Add timetable</button>
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
