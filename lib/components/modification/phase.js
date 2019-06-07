import get from 'lodash/get'
import React, {PureComponent} from 'react'

import message from 'lib/message'
import {toString as timetableToString} from 'lib/utils/timetable'

import Select from '../select'
import {Group as FormGroup} from '../input'
import MinutesSeconds from '../minutes-seconds'

export default class Phase extends PureComponent {
  state = {}

  static getDerivedStateFromProps(props) {
    return {selectedTimetable: getSelectedTimetable(props)}
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.phaseFromTimetable !== prevProps.phaseFromTimetable &&
      !this.state.selectedTimetable
    ) {
      this._setPhaseFromTimetable(null) // timetable does not exist
    }
  }

  componentDidMount() {
    if (this.props.phaseFromTimetable && !this.state.selectedTimetable) {
      this._setPhaseFromTimetable(null)
    }
  }

  _setPhaseAtStop = stop => {
    this.props.update({phaseAtStop: get(stop, 'stop_id')})
  }

  _setPhaseFromTimetable = timetable => {
    this.props.update({
      phaseFromTimetable: timetable && timetable.value,
      phaseFromStop: null
    })
  }

  _setPhaseFromStop = stop => {
    this.props.update({phaseFromStop: stop && stop.value})
  }

  _setPhaseSeconds = phaseSeconds => {
    this.props.update({phaseSeconds})
  }

  render() {
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
    return (
      <>
        <FormGroup label={message('phasing.atStop')}>
          <Select
            disabled={disabled}
            name={message('phasing.atStop')}
            getOptionLabel={s => s.stop_name}
            getOptionValue={s => s.stop_id}
            onChange={this._setPhaseAtStop}
            options={modificationStops}
            placeholder={message('phasing.atStop')}
            value={modificationStops.find(s => s.stop_id === phaseAtStop)}
          />
        </FormGroup>
        {disabled && (
          <div className='alert alert-info' role='alert'>
            {message('phasing.disabled')}
          </div>
        )}
        {phaseAtStop && (
          <>
            <FormGroup label={message('phasing.fromTimetable')}>
              <Select
                name={message('phasing.fromTimetable')}
                getOptionLabel={t =>
                  `${t.modificationName}: ${timetableToString(t)}`
                }
                getOptionValue={t => `${t.modificationId}:${t._id}`}
                onChange={this._setPhaseFromTimetable}
                options={availableTimetables}
                placeholder={message('phasing.fromTimetable')}
                value={selectedTimetable}
              />
            </FormGroup>
            {phaseFromTimetable && selectedTimetable && (
              <>
                {selectedTimetable.headwaySecs !== timetableHeadway && (
                  <div className='alert alert-danger' role='alert'>
                    {message('phasing.headwayMismatchWarning', {
                      selectedTimetableHeadway:
                        selectedTimetable.headwaySecs / 60
                    })}
                  </div>
                )}
                {selectedPhaseFromTimetableStops &&
                selectedPhaseFromTimetableStops.length > 0 ? (
                  <FormGroup label={message('phasing.fromStop')}>
                    <Select
                      getOptionLabel={s => s.stop_name}
                      getOptionValue={s => s.stop_id}
                      name={message('phasing.fromStop')}
                      onChange={this._setPhaseFromStop}
                      options={selectedPhaseFromTimetableStops}
                      placeholder={message('phasing.fromStop')}
                      value={selectedPhaseFromTimetableStops.find(
                        s => s.stop_id === phaseFromStop
                      )}
                    />
                  </FormGroup>
                ) : (
                  <div className='alert alert-danger' role='alert'>
                    {message('phasing.noAvailableStopsWarning')}
                  </div>
                )}
                {phaseFromStop && (
                  <MinutesSeconds
                    label={message('phasing.minutes')}
                    onChange={this._setPhaseSeconds}
                    seconds={phaseSeconds}
                  />
                )}
              </>
            )}
          </>
        )}
      </>
    )
  }
}

function getSelectedTimetable(opts) {
  return opts.availableTimetables.find(
    tt =>
      opts.phaseFromTimetable &&
      tt._id === opts.phaseFromTimetable.split(':')[1]
  )
}
