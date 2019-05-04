import React from 'react'

import message from 'lib/message'
import R5Version from 'lib/modules/r5-version'

import DatePicker from '../date-picker'
import TimePicker from '../time-picker'

import ModeSelector from './mode-selector'

/**
 * Edit the parameters of a profile request.
 */
export default function ProfileRequestEditor(p) {
  function set(newFields) {
    p.setProfileRequest(newFields)
  }

  const setFromTime = fromTime => set({fromTime: parseInt(fromTime)})
  const setToTime = toTime => set({toTime: parseInt(toTime)})
  const setDate = date => set({date})

  const {disabled, profileRequest, setProfileRequest} = p
  const {date, fromTime, toTime} = profileRequest
  return (
    <>
      <ModeSelector
        accessModes={profileRequest.accessModes}
        directModes={profileRequest.directModes}
        disabled={disabled}
        transitModes={profileRequest.transitModes}
        update={setProfileRequest}
      />
      <div className='row'>
        <div className='form-group col-xs-4'>
          <label htmlFor={message('analysis.date')}>
            {message('analysis.date')}
          </label>
          <DatePicker disabled={disabled} value={date} onChange={setDate} />
        </div>
        <div className='col-xs-4'>
          <TimePicker
            disabled={disabled}
            label={message('analysis.fromTime')}
            value={fromTime}
            name='fromTime'
            onChange={setFromTime}
          />
        </div>
        <div className='col-xs-4'>
          <TimePicker
            disabled={disabled}
            label={message('analysis.toTime')}
            value={toTime}
            name='toTime'
            onChange={setToTime}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12'>
          <R5Version.components.Selector />
        </div>
      </div>
    </>
  )
}
