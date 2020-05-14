import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Switch
} from '@chakra-ui/core'
import {useRef, MutableRefObject} from 'react'
import {FeatureGroup} from 'react-leaflet'
import {EditControl} from 'react-leaflet-draw'

import type {FeatureCollection} from 'geojson'

import useControlledInput from '../../hooks/use-controlled-input'

const drawSettings = {
  polyline: true,
  polygon: false,
  rectangle: false,
  circle: false,
  marker: false,
  circlemarker: false
}

// Check if the value is a feature collection
const isFeatureCollection = (fc: any): fc is FeatureCollection =>
  (fc as FeatureCollection).features !== undefined

/**
 * Must be rendered in a MapLayout
 */
export default function AddStreetLink(p) {
  const featureGroupRef: MutableRefObject<FeatureGroup> = useRef()
  const updateValue = (name: string) => (value: any) => {
    p.update({...p.modification, [name]: value})
  }

  const bikeSwitch: any = useControlledInput(true, updateValue('mode'))
  const bikeGC: any = useControlledInput(1, updateValue('bikeGeneralizedCost'))
  const bikeLTSInput: any = useControlledInput(1, updateValue('bikeLTS'))

  const carSwitch: any = useControlledInput(true, updateValue('mode'))
  const carSpeed: any = useControlledInput(1, updateValue('carSpeed'))

  const walkSwitch: any = useControlledInput(true, updateValue('mode'))
  const walkGC: any = useControlledInput(1, updateValue('walkGeneralizedCost'))

  const onGeometryChange = (name: string) => () => {
    const featureCollection = featureGroupRef.current.leafletElement.toGeoJSON()
    if (isFeatureCollection(featureCollection)) {
      featureCollection.features.forEach((feature) => {})
    }
  }

  return (
    <>
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          draw={drawSettings}
          position='topright'
          onDeleteStop={onGeometryChange('onDeleteStop')}
          onDrawStop={onGeometryChange('onDrawStop')}
          onEditStop={onGeometryChange('onEditStop')}
        />
      </FeatureGroup>

      <Stack>
        <Box>
          <Flex justify='space-between'>
            <FormLabel htmlFor='bikeSwitch' fontSize='lg'>
              Enable biking
            </FormLabel>
            <Switch
              id='bikeSwitch'
              isChecked={bikeSwitch.value}
              onChange={bikeSwitch.onChange}
            />
          </Flex>
          {bikeSwitch.value && (
            <Stack mb={6}>
              <FormControl isInvalid={!bikeGC.isValid}>
                <FormLabel>Bike Generalized Cost</FormLabel>
                <Input {...bikeGC} />
              </FormControl>
              <FormControl>
                <FormLabel>Bike Level of Traffic Stress</FormLabel>
                <Select>
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
            <FormLabel htmlFor='carSwitch' fontSize='lg'>
              Enable driving
            </FormLabel>
            <Switch
              id='carSwitch'
              isChecked={carSwitch.value}
              onChange={carSwitch.onChange}
            />
          </Flex>
          {carSwitch.value && (
            <FormControl isInvalid={carSpeed.isInvalid} mb={6}>
              <FormLabel>Car Speed</FormLabel>
              <Input {...carSpeed} />
            </FormControl>
          )}
        </Box>

        <Box>
          <Flex justify='space-between'>
            <FormLabel htmlFor='walkSwitch' fontSize='lg'>
              Enable walking
            </FormLabel>
            <Switch
              id='walkSwitch'
              isChecked={walkSwitch.value}
              onChange={walkSwitch.onChange}
            />
          </Flex>
          {walkSwitch.value && (
            <FormControl isInvalid={walkGC.isInvalid}>
              <FormLabel htmlFor='walkGC'>Walk Generalized Cost</FormLabel>
              <Input id='walkGC' {...walkGC} />
            </FormControl>
          )}
        </Box>
      </Stack>
    </>
  )
}
