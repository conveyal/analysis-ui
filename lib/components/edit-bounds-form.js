import {
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  NumberInput,
  NumberInputField,
  Stack,
  Text
} from '@chakra-ui/core'
import startCase from 'lodash/startCase'
import React from 'react'

import message from 'lib/message'

import A from './a'

export default function EditBoundsForm(p) {
  const [bounds, setBounds] = React.useState(p.bounds)
  // Keep bounds in sync with external prop changes
  React.useEffect(() => setBounds(p.bounds), [p.bounds])

  const onLatChange = d => v => {
    setBounds(b => ({...b, [d]: v}))
    if (v <= 90 && v >= -90) p.onChange(d, v)
  }
  const onLonChange = d => v => {
    setBounds(b => ({...b, [d]: v}))
    if (v <= 180 && v >= -180) p.onChange(d, v)
  }

  return (
    <Stack spacing={4} mb={4}>
      <Heading size='sm'>{message('region.bounds')}</Heading>
      <Text>
        <span>{message('region.boundsNotice')} </span>
        <A
          href='http://docs.analysis.conveyal.com/en/latest/analysis/methodology.html#spatial-resolution'
          rel='noopener noreferrer'
          target='_blank'
        >
          Learn more about spatial resolution here.
        </A>
      </Text>
      {['north', 'south'].map(d => (
        <FormControl isDisabled={p.isDisabled} isRequired key={d}>
          <FormLabel htmlFor={`${d}-input`}>{startCase(d)} bound</FormLabel>
          <NumberInput
            keepWithinRange={false}
            max='90'
            min='-90'
            onChange={onLatChange(d)}
            value={bounds[d] + ''}
          >
            <NumberInputField id={`${d}-input`} />
          </NumberInput>
          <FormHelperText htmlFor={`${d}-input`}>
            {startCase(d)} must be between 90 and -90 degrees.
          </FormHelperText>
        </FormControl>
      ))}
      {['east', 'west'].map(d => (
        <FormControl isDisabled={p.isDisabled} isRequired key={d}>
          <FormLabel htmlFor={`${d}-input`}>{startCase(d)} bound</FormLabel>
          <NumberInput
            keepWithinRange={false}
            onChange={onLonChange(d)}
            max='180'
            min='-180'
            value={bounds[d]}
          >
            <NumberInputField id={`${d}-input`} />
          </NumberInput>
          <FormHelperText htmlFor={`${d}-input`}>
            {startCase(d)} must be between 180 and -180 degrees.
          </FormHelperText>
        </FormControl>
      ))}
    </Stack>
  )
}
