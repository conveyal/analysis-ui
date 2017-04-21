import React, {PropTypes, PureComponent} from 'react'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'

import messages from '../../utils/messages'

import {
  Group as FormGroup,
  Number as InputNumber
} from '../input'
import {
  toString as timetableToString
} from '../../utils/timetable'

export default class Phase extends PureComponent {
  static propTypes = {
    availableTimetables: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    modificationStops: PropTypes.array.isRequired,
    phaseAtStop: PropTypes.string,
    phaseFromTimetable: PropTypes.string,
    phaseFromStop: PropTypes.string,
    phaseSeconds: PropTypes.number,
    selectedPhaseFromTimetableStops: PropTypes.array,
    timetableHeadway: PropTypes.number,

    // actions
    update: PropTypes.func.isRequired
  }

  state = {
    selectedTimetable: getSelectedTimetable(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const selectedTimetable = getSelectedTimetable(nextProps)
    this.setState({selectedTimetable})
    if (nextProps.phaseFromTimetable && !selectedTimetable) {
      this._setPhaseFromTimetable(null) // timetable does not exist
    }
  }

  componentDidMount () {
    if (this.props.phaseFromTimetable && !this.state.selectedTimetable) {
      this._setPhaseFromTimetable(null)
    }
  }

  _setPhaseAtStop = (stop) => {
    this.props.update({phaseAtStop: stop && stop.value})
  }

  _setPhaseFromTimetable = (timetable) => {
    this.props.update({
      phaseFromTimetable: timetable && timetable.value,
      phaseFromStop: null
    })
  }

  _setPhaseFromStop = (stop) => {
    this.props.update({phaseFromStop: stop && stop.value})
  }

  _setPhaseSeconds = (event) => {
    const phaseSeconds = parseInt(event.target.value || 0, 10) * 60
    if (phaseSeconds !== 0 && !isNaN(phaseSeconds)) {
      this.props.update({phaseSeconds})
    }
  }

  render () {
    const {
      availableTimetables,
      disabled,
      phaseAtStop,
      phaseFromStop,
      phaseFromTimetable,
      phaseSeconds,
      modificationStops,
      selectedPhaseFromTimetableStops,
      timetableHeadway
    } = this.props
    const {selectedTimetable} = this.state
    return <div>
      <FormGroup label={messages.phasing.atStop}>
        <Select
          disabled={disabled}
          name={messages.phasing.atStop}
          onChange={this._setPhaseAtStop}
          options={modificationStops.map((stop) =>
            ({value: stop.stop_id, label: stop.stop_name}))}
          placeholder={messages.phasing.atStop}
          value={phaseAtStop}
          />
      </FormGroup>
      {disabled &&
        <div className='alert alert-info' role='alert'>{messages.phasing.disabled}</div>}
      {phaseAtStop &&
        <div>
          <FormGroup label={messages.phasing.fromTimetable}>
            <Select
              name={messages.phasing.fromTimetable}
              onChange={this._setPhaseFromTimetable}
              options={availableTimetables.map((timetable) => ({
                value: `${timetable.modificationId}:${timetable.id}`,
                label: `${timetable.modificationName}: ${timetableToString(timetable)}`
              }))}
              placeholder={messages.phasing.fromTimetable}
              value={phaseFromTimetable}
              />
          </FormGroup>
          {phaseFromTimetable && selectedTimetable &&
            <div>
              {selectedTimetable.headwaySecs !== timetableHeadway &&
                <div className='alert alert-danger' role='alert'>{sprintf(messages.phasing.headwayMismatchWarning, {
                  selectedTimetableHeadway: selectedTimetable.headwaySecs / 60
                })}</div>}
              {selectedPhaseFromTimetableStops && selectedPhaseFromTimetableStops.length > 0
                ? <FormGroup label={messages.phasing.fromStop}>
                  <Select
                    name={messages.phasing.fromStop}
                    onChange={this._setPhaseFromStop}
                    options={selectedPhaseFromTimetableStops.map((stop) =>
                      ({value: stop.stop_id, label: stop.stop_name}))}
                    placeholder={messages.phasing.fromStop}
                    value={phaseFromStop}
                    />
                </FormGroup>
                : <div className='alert alert-danger' role='alert'>{messages.phasing.noAvailableStopsWarning}</div>
              }
              {phaseFromStop &&
                <InputNumber
                  label={messages.phasing.minutes}
                  onChange={this._setPhaseSeconds}
                  units='minutes'
                  value={phaseSeconds / 60}
                />}
            </div>
          }
        </div>
      }
    </div>
  }
}

const getSelectedTimetable = ({availableTimetables, phaseFromTimetable}) => phaseFromTimetable &&
  availableTimetables.find((tt) =>
    tt.id === phaseFromTimetable.split(':')[1])
