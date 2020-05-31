import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/core'
import moment from 'moment'
import React from 'react'

import useControlledInput from 'lib/hooks/use-controlled-input'
import {secondsToMoment} from 'lib/utils/time'

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
  onChange,
  value,
  ...p
}) {
  const input = useControlledInput(
    secondsToMoment(value).format(FORMAT),
    (timeString) => onChange(moment.duration(timeString).as('seconds')),
    testValid
  )

  return (
    <FormControl isDisabled={disabled} isInvalid={input.isInvalid} {...p}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        <Input id={id} type='text' {...input} />
        <InputRightElement color='gray.400' userSelect='none' mr={5}>
          {FORMAT}
        </InputRightElement>
      </InputGroup>
    </FormControl>
  )
}
