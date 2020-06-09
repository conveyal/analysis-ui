import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/core'
import moment from 'moment'
import React from 'react'

import useInput from 'lib/hooks/use-controlled-input'
import {secondsToMoment} from 'lib/utils/time'

const FORMAT = 'HH:mm'

const test = (seconds) => !isNaN(seconds) && seconds >= 0
const parse = (timeString) => moment.duration(timeString).as('seconds')

/**
 * Choose hours of day, using seconds since midnight
 */
export default function TimePicker({disabled, label, onChange, value, ...p}) {
  const input = useInput({
    onChange,
    parse,
    test,
    value: secondsToMoment(value).format(FORMAT)
  })

  return (
    <FormControl isDisabled={disabled} isInvalid={input.isInvalid} {...p}>
      <FormLabel htmlFor={input.htmlFor}>{label}</FormLabel>
      <InputGroup>
        <Input id={input.id} type='text' {...input} />
        <InputRightElement color='gray.400' userSelect='none' mr={5}>
          {FORMAT}
        </InputRightElement>
      </InputGroup>
    </FormControl>
  )
}
