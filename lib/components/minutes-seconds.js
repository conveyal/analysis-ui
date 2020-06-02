import moment from 'moment'
import React from 'react'

import useControlledInput from 'lib/hooks/use-controlled-input'
import {secondsToHhMmSsString} from 'lib/utils/time'

import {Group, Input} from './input'

const FORMAT = 'HH:mm:ss'

const test = (parsed) => parsed > 0
const parse = (targetValue) => moment.duration(targetValue).as('seconds')

export default function MinutesSeconds({
  disabled,
  id,
  label,
  onChange,
  seconds,
  ...p
}) {
  const input = useControlledInput({
    onChange,
    parse,
    test,
    value: secondsToHhMmSsString(Math.round(seconds))
  })

  return (
    <Group className={input.isValid ? '' : 'has-error'} id={id} label={label}>
      <Input
        {...p}
        {...input}
        disabled={disabled}
        id={id}
        type='text'
        units={FORMAT.toLowerCase()}
      />
    </Group>
  )
}
