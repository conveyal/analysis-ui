import {
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text
} from '@chakra-ui/core'
import startCase from 'lodash/startCase'
import React from 'react'

import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

import {SPACING_FORM} from 'lib/constants/chakra'
import message from 'lib/message'

import Icon from './icon'
import A from './a'

const directions = [
  {
    name: 'north',
    min: -90,
    max: 90,
    isValid: (n, b) => n > b.south
  },
  {
    name: 'south',
    min: -90,
    max: 90,
    isValid: (s, b) => s < b.north
  },
  {
    name: 'east',
    min: -180,
    max: 180,
    isValid: (e, b) => e > b.west
  },
  {
    name: 'west',
    min: -180,
    max: 180,
    isValid: (w, b) => w < b.east
  }
]

export default function EditBoundsForm(p) {
  const [bounds, setBounds] = React.useState(p.bounds)
  const [isFocused, setIsFocused] = React.useState(false)

  // Update local bounds if external bounds changed while input is not focused
  React.useEffect(() => {
    if (!isFocused) setBounds(p.bounds)
  }, [isFocused, p.bounds])

  function boundIsInvalid(dir, value) {
    const parsed = parseFloat(value)
    return (
      isNaN(parsed) ||
      parsed < dir.min ||
      parsed > dir.max ||
      !dir.isValid(parsed, bounds)
    )
  }

  const onChange = d => e => {
    const value = e.target.value
    setBounds(b => ({...b, [d.name]: value}))
    if (!boundIsInvalid(d, value)) p.onChange(d.name, parseFloat(value))
  }

  return (
    <Stack spacing={SPACING_FORM} mb={p.mb}>
      <Heading size='sm'>{message('region.bounds')}</Heading>
      <Text>
        <span>{message('region.boundsNotice')} </span>
        <A
          href='http://docs.analysis.conveyal.com/en/latest/analysis/methodology.html#spatial-resolution'
          rel='noopener noreferrer'
          target='_blank'
        >
          <Icon icon={faInfoCircle} />
        </A>
      </Text>
      {directions.map(d => (
        <FormControl
          isDisabled={p.isDisabled}
          isInvalid={boundIsInvalid(d, bounds[d.name])}
          isRequired
          key={d.name}
        >
          <FormLabel htmlFor={`${d.name}-bound`}>
            {startCase(d.name)} bound
          </FormLabel>
          <Input
            onBlur={() => setIsFocused(false)}
            onChange={onChange(d)}
            onFocus={() => setIsFocused(true)}
            id={`${d.name}-bound`}
            value={bounds[d.name]}
          />
          <FormHelperText htmlFor={`${d.name}-bound`}>
            {startCase(d.name)} must be between {d.min} and {d.max} degrees.
          </FormHelperText>
        </FormControl>
      ))}
    </Stack>
  )
}
