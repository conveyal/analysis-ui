import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/core'

import useControlledInput from 'lib/hooks/use-controlled-input'

const defaultTest = (parsed: number) => parsed >= 1
const defaultParse = (targetValue: string) => parseFloat(targetValue)

const noop = () => {}

type NumberInputProps = FormControlProps & {
  label?: string
  onChange: (newValue: number) => void
  parse?: (targetValue: string) => number
  test?: (parsed: number) => boolean
  units?: string
  value: number
}

export default function NumberInput({
  isDisabled = false,
  label = '',
  onBlur = noop,
  onChange,
  onFocus = noop,
  parse = defaultParse,
  placeholder = '',
  test = defaultTest,
  units = '',
  value,
  ...p
}: NumberInputProps) {
  const input = useControlledInput({
    onChange,
    parse,
    test,
    value
  })

  return (
    <FormControl isDisabled={isDisabled} isInvalid={input.isInvalid} {...p}>
      {label && <FormLabel htmlFor={input.id}>{label}</FormLabel>}
      <InputGroup>
        <Input
          {...input}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          type='text'
        />
        {units && (
          <InputRightElement
            color='gray.400'
            userSelect='none'
            mr={4}
            width='unset'
          >
            {units}
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  )
}
