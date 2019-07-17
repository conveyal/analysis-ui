import moment from 'moment'
import React from 'react'

import {secondsToMoment} from 'lib/utils/time'

import {Group, Input} from './input'

const FORMAT = 'HH:mm:ss'

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
    const date = moment(timeString, FORMAT, true)
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
        value={seconds !== undefined ? minutesSeconds : undefined}
      />
    </Group>
  )
}
