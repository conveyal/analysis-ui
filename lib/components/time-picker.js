import moment from 'moment'
import React from 'react'

import useControlledInput from 'lib/hooks/use-controlled-input'
import {secondsToMoment} from 'lib/utils/time'

import {Group, Input} from './input'

const FORMAT = 'HH:mm'

function testValid(timeString) {
  const date = moment(timeString, FORMAT, true)
  if (!date.isValid()) return false
  return moment.duration(timeString).as('seconds') >= 0
}

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
  const [
    inputValue,
    inputOnChange,
    inputRef,
    inputIsValid
  ] = useControlledInput(
    secondsToMoment(value).format(FORMAT),
    (timeString) => onChange(moment.duration(timeString).as('seconds')),
    testValid
  )

  return (
    <Group className={inputIsValid ? '' : 'has-error'} label={label} id={id}>
      <Input
        disabled={disabled}
        id={id}
        name={name}
        onChange={inputOnChange}
        ref={inputRef}
        type='text'
        units={FORMAT.toLowerCase()}
        value={inputValue}
      />
    </Group>
  )
}
