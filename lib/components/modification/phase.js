import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {
  Group as FormGroup,
  Number as InputNumber
} from '../input'
import {
  toString as timetableToString
} from '../../utils/timetable'

export default class Phase extends Component {
  static propTypes = {
    availableTimetables: PropTypes.array.isRequired,
    modificationStops: PropTypes.array.isRequired,
    phaseAtStop: PropTypes.string,
    phaseFromTimetable: PropTypes.string,
    phaseFromStop: PropTypes.string,
    phaseSeconds: PropTypes.number.isRequired,
    selectedPhaseFromTimetableStops: PropTypes.array,

    // actions
    update: PropTypes.func.isRequired
  }

  _setPhaseAtStop = (stop) => {
    this.props.update({phaseAtStop: stop && stop.value})
  }

  _setPhaseFromStop = (stop) => {
    this.props.update({phaseFromStop: stop && stop.value})
  }

  _setPhaseFromTimetable = (timetable) => {
    this.props.update({phaseFromTimetable: timetable && timetable.value})
  }

  _setPhaseSeconds = (event) => {
    this.props.update({phaseSeconds: parseInt(event.target.value || 0, 10) * 60})
  }

  render () {
    const {
      availableTimetables,
      phaseAtStop,
      phaseFromStop,
      phaseFromTimetable,
      phaseSeconds,
      modificationStops,
      selectedPhaseFromTimetableStops
    } = this.props
    return <div>
      <FormGroup>
        <Select
          name='Phase at stop'
          onChange={this._setPhaseAtStop}
          options={modificationStops.map((stop) =>
            ({value: stop.stop_id, label: stop.stop_name}))}
          placeholder='Select stop to phase at'
          value={phaseAtStop}
          />
      </FormGroup>
      {phaseAtStop &&
        <FormGroup>
          <Select
            name='Phase from timetable'
            onChange={this._setPhaseFromTimetable}
            options={availableTimetables.map((timetable) => ({
              value: `${timetable.modificationId}:${timetable.id}`,
              label: `${timetable.modificationName}: ${timetableToString(timetable)}`
            }))}
            placeholder='Select timetable to phase from'
            value={phaseFromTimetable}
            />
        </FormGroup>}
      {selectedPhaseFromTimetableStops && selectedPhaseFromTimetableStops.length > 0 &&
        <FormGroup>
          <Select
            name='Phase from stop'
            onChange={this._setPhaseFromStop}
            options={selectedPhaseFromTimetableStops.map((stop) =>
              ({value: stop.stop_id, label: stop.stop_name}))}
            placeholder='Select stop to phase from'
            value={phaseFromStop}
            />
        </FormGroup>}
      <InputNumber
        label='Phase minutes'
        onChange={this._setPhaseSeconds}
        units='minutes'
        value={phaseSeconds / 60}
        />
    </div>
  }
}
