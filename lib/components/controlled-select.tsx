import {FormControl, FormLabel} from '@chakra-ui/core'

import useControlledInput from '../hooks/use-controlled-input'

import Select from './select'

const defaultGetOptionLabel = (o) => o.label
const defaultGetOptionValue = (o) => o.value

export default function ControlledSelect({
  getOptionLabel = defaultGetOptionLabel,
  getOptionValue = defaultGetOptionValue,
  id = null,
  isClearable = false,
  isDisabled = false,
  label,
  options,
  onChange,
  value,
  ...p
}) {
  const input = useControlledInput({id, onChange, value})
  return (
    <FormControl isDisabled={isDisabled} isInvalid={input.isInvalid} {...p}>
      <FormLabel htmlFor={input.htmlFor}>{label}</FormLabel>
      <Select
        inputId={input.id}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isLoading={input.value !== value}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        onChange={input.onChange}
        options={options}
        value={input.value}
      />
    </FormControl>
  )
}
