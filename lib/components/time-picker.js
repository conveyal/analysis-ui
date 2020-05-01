import moment from 'moment'
import React from 'react'

import {secondsToMoment} from 'lib/utils/time'

import {Group, Input} from './input'

const FORMAT = 'HH:mm'

/**
 * Choose hours of day, using seconds since midnight
 */
export default function TimePicker({
  disabled,
  id,
  label,
  name,
  onChange,
  value
}) {
  const [timeProp, setTimeProp] = React.useState(value)
  const [time, setTime] = React.useState(secondsToMoment(value).format(FORMAT))
  const [hasError, setHasError] = React.useState(false)

  // Keep state in line with external changes to the time value.
  if (value !== timeProp) {
    setTimeProp(value)
    setTime(secondsToMoment(value).format(FORMAT))
  }

  function _setTime(e) {
    const timeString = e.currentTarget.value
    setTime(timeString)
    const date = moment(timeString, FORMAT, true)
    if (date.isValid()) {
      setHasError(false)
      const newSeconds = date.hours() * 3600 + date.minutes() * 60
      if (!isNaN(newSeconds)) onChange(newSeconds)
    } else {
      setHasError(true)
    }
  }

  return (
    <Group className={hasError ? 'has-error' : ''} label={label} id={id}>
      <Input
        disabled={disabled}
        id={id}
        name={name}
        onChange={_setTime}
        type='text'
        units={FORMAT.toLowerCase()}
        value={time}
      />
    </Group>
  )
}
