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
import L from 'leaflet'
import {useRef, MutableRefObject, useEffect} from 'react'
import {FeatureGroup} from 'react-leaflet'
import {EditControl} from 'react-leaflet-draw'

import type {FeatureCollection, LineString} from 'geojson'

import {BICYCLE, CAR, WALK} from 'lib/constants'
import useControlledInput from 'lib/hooks/use-controlled-input'
import useModification from 'lib/hooks/use-modification'

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

// Is input value a valid float?
const isValidFloat = (v: any) => {
  const parsed = parseFloat(v)
  return !isNaN(parsed) && parsed > 0
}

/**
 * Must be rendered in a MapLayout
 */
export default function AddStreets() {
  const featureGroupRef: MutableRefObject<FeatureGroup> = useRef()
  const [m, update] = useModification()

  // Add the existing layers to the map on initial load
  useEffect(() => {
    if (featureGroupRef.current) {
      m.lineStrings.forEach((coordinates) => {
        const layer = new L.GeoJSON(
          L.GeoJSON.asFeature({
            type: 'LineString',
            coordinates
          })
        )
        layer.eachLayer((l) =>
          featureGroupRef.current.leafletElement.addLayer(l)
        )
      })
    }
  }, [featureGroupRef])

  const updateFloat = (name: string) => (value: any) => {
    update({[name]: parseFloat(value)})
  }

  const updateMode = (mode: string) => (on: boolean) => {
    const modes = new Set(m.allowedModes)
    if (on) modes.add(mode)
    else modes.delete(mode)
    update({allowedModes: Array.from(modes)})
  }

  const bikeSwitch: any = useControlledInput(
    m.allowedModes.includes(BICYCLE),
    updateMode(BICYCLE)
  )
  const bikeGCF: any = useControlledInput(
    m.bikeGenCostFactor,
    updateFloat('bikeGenCostFactor'),
    isValidFloat
  )
  const bikeLts: any = useControlledInput(m.bikeLts, (v: any) =>
    update({bikeLts: parseInt(v)})
  )

  const carSwitch: any = useControlledInput(
    m.allowedModes.includes(CAR),
    updateMode(CAR)
  )
  const carSpeed: any = useControlledInput(
    m.carSpeedKph,
    updateFloat('carSpeedKph'),
    isValidFloat
  )

  const walkSwitch: any = useControlledInput(
    m.allowedModes.includes(WALK),
    updateMode(WALK)
  )
  const walkGCF: any = useControlledInput(
    m.walkGenCostFactor,
    updateFloat('walkGenCostFactor'),
    isValidFloat
  )

  // Handle create, delete, and edit
  const onGeometryChange = (name: string) => () => {
    const featureCollection = featureGroupRef.current.leafletElement.toGeoJSON()
    if (isFeatureCollection(featureCollection)) {
      const lineStrings = featureCollection.features
        .filter((feature) => {
          if (feature.geometry.type === 'LineString') {
            return (feature.geometry.coordinates || []).length > 1
          }
          return false
        })
        .map((feature) => (feature.geometry as LineString).coordinates)
      update({lineStrings})
    }
  }

  return (
    <>
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          draw={drawSettings}
          position='topright'
          onCreated={onGeometryChange('onCreated')}
          onDeleted={onGeometryChange('onDeleted')}
          onEdited={onGeometryChange('onEdited')}
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
            <Stack spacing={4} mb={6}>
              <FormControl isInvalid={!bikeGCF.isValid}>
                <FormLabel htmlFor='bikeGCF'>
                  Bike Generalized Cost Factor
                </FormLabel>
                <Input id='bikeGCF' {...bikeGCF} />
                <FormHelperText>Must be greater than 0</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='bikeLts'>
                  Bike Level of Traffic Stress
                </FormLabel>
                <Select
                  id='bikeLts'
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
              <FormLabel htmlFor='carSpeed'>Car Speed</FormLabel>
              <Input id='carSpeed' {...carSpeed} />
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
            <FormControl isInvalid={walkGCF.isInvalid}>
              <FormLabel htmlFor='walkGCF'>
                Walk Generalized Cost Factor
              </FormLabel>
              <Input id='walkGCF' {...walkGCF} />
              <FormHelperText>Must be greater than 0</FormHelperText>
            </FormControl>
          )}
        </Box>
      </Stack>
    </>
  )
}
