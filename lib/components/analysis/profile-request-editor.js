import React from 'react'
import DateTime from 'react-datetime'

import message from 'lib/message'
import R5Version from 'lib/modules/r5-version'

import {Group} from '../input'
import TimePicker from '../time-picker'

import ModeSelector from './mode-selector'

const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * Edit the parameters of a profile request.
 */
export default function ProfileRequestEditor(p) {
  function set(newFields) {
    p.setProfileRequest(newFields)
  }

  const setFromTime = (fromTime) => set({fromTime: parseInt(fromTime)})
  const setToTime = (toTime) => set({toTime: parseInt(toTime)})

  const [dateIsValid, setDateIsValid] = React.useState(true)
  function setDate(date) {
    if (!date || !date.isValid || !date.isValid()) {
      return setDateIsValid(false)
    }
    setDateIsValid(true)
    set({date: date.format(DATE_FORMAT)})
  }

  const {profileRequest, setProfileRequest} = p
  const {date, fromTime, toTime} = profileRequest
  return (
    <>
      <ModeSelector
        accessModes={profileRequest.accessModes}
        directModes={profileRequest.directModes}
        disabled={p.disabled}
        transitModes={profileRequest.transitModes}
        update={setProfileRequest}
      />
      <div className='row'>
        {p.bundleOutOfDate && (
          <div className='col-xs-12'>
            <div className='alert alert-warning'>
              <strong>Warning! </strong>
              <span dangerouslySetInnerHTML={{__html: p.bundleOutOfDate}} />
            </div>
          </div>
        )}
        <Group
          className={`col-xs-4 ${p.bundleOutOfDate ? 'has-warning' : ''} ${
            !dateIsValid ? 'has-error' : ''
          }`}
          label={message('analysis.date')}
        >
          <DateTime
            closeOnSelect
            dateFormat={DATE_FORMAT}
            inputProps={{
              disabled: p.disabled
            }}
            onChange={setDate}
            timeFormat={false}
            utc // because new Date('2016-12-12') yields a date at midnight UTC
            value={date}
          />
        </Group>
        <div className='col-xs-4'>
          <TimePicker
            disabled={p.disabled}
            label={message('analysis.fromTime')}
            name='fromTime'
            value={fromTime}
            onChange={setFromTime}
          />
        </div>
        <div className='col-xs-4'>
          <TimePicker
            disabled={p.disabled}
            label={message('analysis.toTime')}
            name='toTime'
            value={toTime}
            onChange={setToTime}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12'>
          <R5Version.components.Selector disabled={p.disabled} />
        </div>
      </div>
    </>
  )
}
