import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  FormControlProps
} from '@chakra-ui/core'
import moment from 'moment'
import {memo, SyntheticEvent} from 'react'

import useControlledInput from 'lib/hooks/use-controlled-input'
import {secondsToHhMmSsString} from 'lib/utils/time'

const FORMAT = 'HH:mm:ss'

const test = (parsed) => parsed >= 0
const parse = (targetValue) => moment.duration(targetValue).as('seconds')

const noop = () => {}

type Props = {
  disabled?: boolean
  label: string
  onBlur?: (SyntheticEvent) => void
  onChange: (number) => void
  onFocus?: (SyntheticEvent) => void
  placeholder?: string
  seconds: number
}

export default memo<Props & FormControlProps>(function MinutesSeconds({
  disabled = false,
  label,
  onBlur = noop,
  onChange,
  onFocus = noop,
  placeholder = '',
  seconds,
  ...p
}) {
  const input = useControlledInput({
    onChange,
    parse,
    test,
    value:
      seconds != null ? secondsToHhMmSsString(Math.round(seconds)) : undefined
  })
  return (
    <FormControl isDisabled={disabled} isInvalid={input.isInvalid} {...p}>
      <FormLabel htmlFor={input.id}>{label}</FormLabel>
      <InputGroup>
        <Input
          {...input}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          type='text'
        />
        <InputRightElement
          color='gray.400'
          userSelect='none'
          mr={4}
          width='unset'
        >
          {FORMAT}
        </InputRightElement>
      </InputGroup>
    </FormControl>
  )
})
