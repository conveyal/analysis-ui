import moment from 'moment'
import React from 'react'

import {Text} from './input'

const FORMAT = 'HH:mm'

function secondsToMoment(s) {
  // end time may be past midnight
  const secs = s % (60 * 60 * 24)
  const minutes = Math.round(secs / 60)
  const hours = Math.floor(minutes / 60)
  return moment({hours, minutes: minutes % 60})
}

/**
 * Choose hours of day, using seconds since midnight
 */
export default function TimePicker({onChange, value, ...p}) {
  function _setTime(e) {
    const timeString = e.currentTarget.value
    if (timeString == null) return
    const date = moment(timeString, FORMAT)
    const newSeconds = date.hours() * 3600 + date.minutes() * 60
    if (!isNaN(newSeconds)) onChange(newSeconds)
  }

  const m = secondsToMoment(value)

  return (
    <Text
      {...p}
      onChange={_setTime}
      units={FORMAT.toLowerCase()}
      value={m.isValid() ? m.format(FORMAT) : ''}
    />
  )
}
