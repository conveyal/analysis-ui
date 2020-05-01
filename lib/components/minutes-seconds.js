import React from 'react'

import {secondsToHhMmSsString} from 'lib/utils/time'

import {Group, Input} from './input'

const FORMAT = 'HH:mm:ss'

export default function MinutesSeconds({
  disabled,
  id,
  label,
  onChange,
  seconds,
  ...p
}) {
  const [secondsProp, setSecondsProp] = React.useState(seconds)
  const [minutesSeconds, setMinutesSeconds] = React.useState(
    secondsToHhMmSsString(Math.round(seconds))
  )
  const [hasError, setHasError] = React.useState(false)

  // Keep state in line with external changes to the second value.
  if (secondsProp !== seconds) {
    setSecondsProp(seconds)
    setMinutesSeconds(secondsToHhMmSsString(Math.round(seconds)))
  }

  function _onChange(e) {
    const timeString = e.currentTarget.value
    setMinutesSeconds(timeString)
    if (!timeString || timeString.length === 0) return setHasError(true)
    const timeComponents = timeString.split(':')
    if (timeComponents.length !== 3) return setHasError(true)
    const hours = parseInt(timeComponents[0])
    if (isNaN(hours) || hours < 0) return setHasError(true)
    const minutes = parseInt(timeComponents[1])
    if (isNaN(minutes) || minutes < 0 || minutes > 59) return setHasError(true)
    const seconds = parseInt(timeComponents[2])
    if (isNaN(seconds) || seconds < 0 || seconds > 59) return setHasError(true)

    setHasError(false)
    const newSeconds = hours * 3600 + minutes * 60 + seconds
    onChange(newSeconds)
  }

  return (
    <Group className={hasError ? 'has-error' : ''} id={id} label={label}>
      <Input
        {...p}
        disabled={disabled}
        onChange={_onChange}
        id={id}
        type='text'
        units={FORMAT.toLowerCase()}
        value={seconds !== undefined ? minutesSeconds : undefined}
      />
    </Group>
  )
}
