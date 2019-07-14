import moment from 'moment'
import React from 'react'

import {Group, Input} from './input'

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
export default function TimePicker({disabled, label, name, onChange, value}) {
  const [time, setTime] = React.useState(secondsToMoment(value).format(FORMAT))
  const [hasError, setHasError] = React.useState(false)

  function _setTime(e) {
    const timeString = e.currentTarget.value
    setTime(timeString)
    const date = moment(timeString, FORMAT)
    if (date.isValid()) {
      setHasError(false)
      const newSeconds = date.hours() * 3600 + date.minutes() * 60
      if (!isNaN(newSeconds)) onChange(newSeconds)
    } else {
      setHasError(true)
    }
  }

  return (
    <Group className={hasError ? 'has-error' : ''} label={label}>
      <Input
        disabled={disabled}
        name={name}
        onChange={_setTime}
        type='text'
        units={FORMAT.toLowerCase()}
        value={time}
      />
    </Group>
  )
}
