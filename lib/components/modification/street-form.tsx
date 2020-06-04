import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Stack,
  Switch
} from '@chakra-ui/core'
import {useCallback, useMemo} from 'react'

import {BICYCLE, CAR, WALK} from 'lib/constants'
import useInput from 'lib/hooks/use-controlled-input'

// Is input value a valid float?
const isValidFloat = (float) => !isNaN(float) && float > 0

export default function StreetForm({modification, update, ...p}) {
  const {allowedModes} = modification

  const updateMode = useCallback(
    (mode: string) => (on: boolean) => {
      const modes = new Set(allowedModes)
      if (on) modes.add(mode)
      else modes.delete(mode)
      update({allowedModes: Array.from(modes)})
    },
    [allowedModes, update]
  )

  const bikeSwitch = useInput({
    onChange: useMemo(() => updateMode(BICYCLE), [updateMode]),
    value: modification.allowedModes.includes(BICYCLE)
  })
  const bikeGCF = useInput({
    onChange: useCallback((bikeGenCostFactor) => update({bikeGenCostFactor}), [
      update
    ]),
    parse: parseFloat,
    test: isValidFloat,
    value: modification.bikeGenCostFactor
  })
  const bikeLts = useInput({
    onChange: useCallback((bikeLts) => update({bikeLts}), [update]),
    parse: parseInt,
    value: modification.bikeLts
  })

  const carSwitch = useInput({
    onChange: useMemo(() => updateMode(CAR), [updateMode]),
    value: modification.allowedModes.includes(CAR)
  })
  const carSpeed = useInput({
    onChange: useCallback((carSpeedKph) => update({carSpeedKph}), [update]),
    parse: parseFloat,
    test: isValidFloat,
    value: modification.carSpeedKph
  })

  const walkSwitch = useInput({
    onChange: useMemo(() => updateMode(WALK), [updateMode]),
    value: modification.allowedModes.includes(WALK)
  })
  const walkGCF = useInput({
    onChange: useCallback((walkGenCostFactor) => update({walkGenCostFactor}), [
      update
    ]),
    parse: parseFloat,
    test: isValidFloat,
    value: modification.walkGenCostFactor
  })

  return (
    <Stack {...p}>
      <Box>
        <Flex justify='space-between'>
          <FormLabel htmlFor={bikeSwitch.htmlFor} fontSize='lg'>
            Enable biking
          </FormLabel>
          <Switch
            id={bikeSwitch.id}
            isChecked={bikeSwitch.value}
            onChange={bikeSwitch.onChange}
          />
        </Flex>
        {bikeSwitch.value && (
          <Stack spacing={4} mb={6}>
            <FormControl isInvalid={!bikeGCF.isValid}>
              <FormLabel htmlFor={bikeGCF.htmlFor}>
                Bike Generalized Cost Factor
              </FormLabel>
              <Input {...bikeGCF} />
              <FormHelperText>Must be greater than 0</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor={bikeLts.htmlFor}>
                Bike Level of Traffic Stress
              </FormLabel>
              <Select
                id={bikeLts.id}
                onChange={bikeLts.onChange}
                value={bikeLts.value}
              >
                <option value={1}>1 - Low stress</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4 - High stress</option>
              </Select>
            </FormControl>
          </Stack>
        )}
      </Box>

      <Box>
        <Flex justify='space-between'>
          <FormLabel htmlFor={carSwitch.htmlFor} fontSize='lg'>
            Enable driving
          </FormLabel>
          <Switch
            id={carSwitch.id}
            isChecked={carSwitch.value}
            onChange={carSwitch.onChange}
          />
        </Flex>
        {carSwitch.value && (
          <FormControl isInvalid={carSpeed.isInvalid} mb={6}>
            <FormLabel htmlFor={carSpeed.htmlFor}>Car Speed</FormLabel>
            <Input {...carSpeed} />
          </FormControl>
        )}
      </Box>

      <Box>
        <Flex justify='space-between'>
          <FormLabel htmlFor={walkSwitch.htmlFor} fontSize='lg'>
            Enable walking
          </FormLabel>
          <Switch
            id={walkSwitch.id}
            isChecked={walkSwitch.value}
            onChange={walkSwitch.onChange}
          />
        </Flex>
        {walkSwitch.value && (
          <FormControl isInvalid={walkGCF.isInvalid}>
            <FormLabel htmlFor={walkGCF.htmlFor}>
              Walk Generalized Cost Factor
            </FormLabel>
            <Input {...walkGCF} />
            <FormHelperText>Must be greater than 0</FormHelperText>
          </FormControl>
        )}
      </Box>
    </Stack>
  )
}
