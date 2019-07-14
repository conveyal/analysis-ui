import moment from 'moment'
import React from 'react'

import {Group, Input} from './input'

const FORMAT = 'HH:mm:ss'

const secondsToMoment = s => {
  const seconds = s % 60
  const minutes = Math.round(s / 60) % 60
  const hours = Math.round(s / 60 / 60) % 24
  return moment({hours, minutes, seconds})
}

export default function MinutesSeconds({
  disabled,
  label,
  onChange,
  seconds,
  ...p
}) {
  const [minutesSeconds, setMinutesSeconds] = React.useState(
    secondsToMoment(Math.round(seconds)).format(FORMAT)
  )
  const [hasError, setHasError] = React.useState(false)

  function _onChange(e) {
    const timeString = e.currentTarget.value
    setMinutesSeconds(timeString)
    const date = moment(timeString, FORMAT)
    if (date.isValid()) {
      setHasError(false)
      const newSeconds =
        date.hours() * 3600 + date.minutes() * 60 + date.seconds()
      if (!isNaN(newSeconds)) onChange(newSeconds)
    } else {
      setHasError(true)
    }
  }

  return (
    <Group className={hasError ? 'has-error' : ''} label={label}>
      <Input
        {...p}
        disabled={disabled}
        onChange={_onChange}
        type='text'
        units={FORMAT.toLowerCase()}
        value={minutesSeconds}
      />
    </Group>
  )
}
