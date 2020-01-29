import {
  FormControl,
  FormHelperText,
  FormLabel,
  NumberInput,
  NumberInputField,
  Stack
} from '@chakra-ui/core'
import startCase from 'lodash/startCase'
import React from 'react'

export default function EditBoundsForm(p) {
  const [invalid, setInvalid] = React.useState({})
  const onLatChange = d => v => {
    if (v > 90 || v < -90) return setInvalid(i => ({...i, [d]: true}))
    setInvalid(i => ({...i, [d]: false}))
    p.onChange(d, v)
  }
  const onLonChange = d => v => {
    if (v > 180 || v < -180) return setInvalid(i => ({...i, [d]: true}))
    setInvalid(i => ({...i, [d]: false}))
    p.onChange(d, v)
  }

  return (
    <Stack spacing={4} mb={4}>
      {['north', 'south'].map(d => (
        <FormControl
          isDisabled={p.isDisabled}
          isInvalid={invalid[d]}
          isRequired
          key={d}
        >
          <FormLabel htmlFor={`${d}-input`}>{startCase(d)} bound</FormLabel>
          <NumberInput
            value={p[d]}
            max={90}
            min={-90}
            onChange={onLatChange(d)}
          >
            <NumberInputField id={`${d}-input`} type='number' />
          </NumberInput>
          <FormHelperText htmlFor={`${d}-input`}>
            {startCase(d)} must be between 90 and -90 degrees.
          </FormHelperText>
        </FormControl>
      ))}
      {['east', 'west'].map(d => (
        <FormControl
          isDisabled={p.isDisabled}
          isInvalid={invalid[d]}
          isRequired
          key={d}
        >
          <FormLabel htmlFor={`${d}-input`}>{startCase(d)} bound</FormLabel>
          <NumberInput
            value={p[d]}
            max={180}
            min={-180}
            onChange={onLonChange(d)}
          >
            <NumberInputField id={`${d}-input`} type='number' />
          </NumberInput>
          <FormHelperText htmlFor={`${d}-input`}>
            {startCase(d)} must be between 180 and -180 degrees.
          </FormHelperText>
        </FormControl>
      ))}
    </Stack>
  )
}
