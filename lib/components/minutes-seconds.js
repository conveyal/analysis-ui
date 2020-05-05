import moment from 'moment'
import React from 'react'

import useControlledInput from 'lib/hooks/use-controlled-input'
import {secondsToHhMmSsString} from 'lib/utils/time'

import {Group, Input} from './input'

const FORMAT = 'HH:mm:ss'

function testValid(timeString) {
  const time = moment(timeString, FORMAT, true)
  if (!time.isValid()) return false
  return moment.duration(timeString).as('seconds') >= 0
}

export default function MinutesSeconds({
  disabled,
  id,
  label,
  onChange,
  seconds,
  ...p
}) {
  const [inputValue, inputOnChange, inputRef, isValid] = useControlledInput(
    secondsToHhMmSsString(Math.round(seconds)),
    (timeString) => onChange(moment.duration(timeString).as('seconds')),
    testValid
  )

  return (
    <Group className={isValid ? '' : 'has-error'} id={id} label={label}>
      <Input
        {...p}
        disabled={disabled}
        onChange={inputOnChange}
        id={id}
        ref={inputRef}
        type='text'
        units={FORMAT.toLowerCase()}
        value={inputValue}
      />
    </Group>
  )
}
