import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack
} from '@chakra-ui/core'
import distance from '@turf/distance'
import {lineString, point} from '@turf/helpers'
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import shp from 'shpjs'

import {createMultiple as createModifications} from 'lib/actions/modifications'
import useRouteTo from 'lib/hooks/use-route-to'
import logrocket from 'lib/logrocket'
import message from 'lib/message'
import {createAddTripPattern} from 'lib/utils/modification'
import {create as createTimetable} from 'lib/utils/timetable'

import NumberInput from './number-input'

const hasOwnProperty = (o, p) => Object.prototype.hasOwnProperty.call(o, p)

/**
 * Import a shapefile. This more or less does what geom2gtfs used to.
 */
export default function ImportShapefile({projectId, regionId, variants}) {
  const dispatch = useDispatch()
  const [
    shapefile,
    setShapefile
  ] = useState<void | shp.FeatureCollectionWithFilename>()
  const [stopSpacingMeters, setStopSpacingMeters] = useState(400)
  const [bidirectional, setBidirectional] = useState(true)
  const [autoCreateStops, setAutoCreateStops] = useState(true)
  const [nameProp, setNameProp] = useState('')
  const [freqProp, setFreqProp] = useState('')
  const [speedProp, setSpeedProp] = useState('')
  const [error, setError] = useState<void | string>()
  const [properties, setProperties] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const routeToModifications = useRouteTo('modifications', {
    projectId,
    regionId
  })

  async function readShapeFile(e) {
    console.log(`read ${e.target.result.byteLength} bytes`)
    const shapefiles = await shp.parseZip(e.target.result)
    const properties = []

    // For TypeScript
    const shapefile: shp.FeatureCollectionWithFilename = Array.isArray(
      shapefiles
    )
      ? shapefiles[0]
      : shapefiles

    for (const key in shapefile.features[0].properties) {
      if (hasOwnProperty(shapefile.features[0].properties, key)) {
        properties.push(key)
      }
    }

    setShapefile(shapefile)
    setProperties(properties)
    setNameProp(properties[0])
    setFreqProp(properties[0])
    setSpeedProp(properties[0])
    setError()
  }

  function selectShapeFile(e) {
    // read the shapefile
    const reader = new window.FileReader()
    reader.onloadend = readShapeFile
    reader.readAsArrayBuffer(e.target.files[0])
  }

  /** create and save modifications for each line */
  async function create() {
    setUploading(true)
    try {
      const variantsFlags = variants.map(() => true)
      if (shapefile) {
        const mods = shapefile.features.map((feat) => {
          const segments = []

          // We make each segment in the input geometry a segment in the output.
          // Otherwise adding a stop in the middle would replace all of the
          // surrounding geometry.
          if (feat.geometry.type !== 'MultiLineString') {
            throw new Error(message('shapefile.invalidShapefileType'))
          }
          const {coordinates} = feat.geometry as GeoJSON.MultiLineString

          // flatten the coordinates
          const flat = []

          for (let i = 0; i < coordinates.length; i++) {
            if (i > 0) {
              // make sure they line up at the ends
              if (
                distance(
                  point(coordinates[i - 1].slice(-1)[0]),
                  point(coordinates[i][0])
                ) > 0.05
              ) {
                throw new Error(message('shapefile.invalidMultiLineString'))
              }

              coordinates[i].forEach((c) => flat.push(c))
            }
          }

          for (let i = 1; i < coordinates.length; i++) {
            segments.push({
              geometry: lineString([flat[i - 1], flat[i]]).geometry,
              spacing: autoCreateStops ? stopSpacingMeters : 0,
              stopAtStart: false,
              stopAtEnd: false,
              fromStopId: null,
              toStopId: null
            })
          }

          if (segments.length > 0) {
            segments[0].stopAtStart = true
            segments[segments.length - 1].stopAtEnd = true
          }

          const mod = createAddTripPattern({
            name: feat.properties[nameProp],
            projectId,
            variants: variantsFlags
          })

          const timetable = createTimetable(
            segments.map(() => feat.properties[speedProp])
          )
          timetable.headwaySecs = feat.properties[freqProp] * 60

          mod.bidirectional = bidirectional
          mod.segments = segments
          mod.timetables = [timetable]

          return mod
        })

        // Create the modifications
        await dispatch(createModifications(mods))

        // If it finishes without error, redirect to the modifications list
        routeToModifications()
      }
    } catch (e) {
      logrocket.captureException(e)
      setError(e.message || 'Error uploading')
      setUploading(false)
    }
  }

  return (
    <Stack p={4} spacing={4}>
      <Heading size='md'>{message('modification.importFromShapefile')}</Heading>

      <FormControl>
        <FormLabel>{message('shapefile.selectZipped')}</FormLabel>
        <Input onChange={selectShapeFile} type='file' />
      </FormControl>

      {error && (
        <Alert status='error'>
          <AlertIcon /> {error}
        </Alert>
      )}

      {properties && shapefile && (
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Name property</FormLabel>
            <Select
              onChange={(e) => setNameProp(e.target.value)}
              value={nameProp}
            >
              {properties.map((p) => (
                <option key={`name-property-${p}`} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Frequency property</FormLabel>
            <Select
              onChange={(e) => setFreqProp(e.target.value)}
              value={freqProp}
            >
              {properties.map((p) => (
                <option key={`frequency-property-${p}`} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Speed property</FormLabel>
            <Select
              onChange={(e) => setSpeedProp(e.target.value)}
              value={speedProp}
            >
              {properties.map((p) => (
                <option key={`speed-property-${p}`} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </FormControl>

          <Checkbox
            isChecked={bidirectional}
            name='bidirectional'
            onChange={(e) => setBidirectional(e.target.checked)}
          >
            Bidirectional
          </Checkbox>

          <Checkbox
            isChecked={autoCreateStops}
            name='autoCreateStops'
            onChange={(e) => setAutoCreateStops(e.target.checked)}
          >
            {message('transitEditor.autoCreateStops')}
          </Checkbox>

          {autoCreateStops && (
            <NumberInput
              label='Stop spacing (meters)'
              onChange={(v) => setStopSpacingMeters(v)}
              value={stopSpacingMeters}
            />
          )}
        </Stack>
      )}

      <Button
        isDisabled={!shapefile || uploading}
        isLoading={uploading}
        onClick={create}
        variantColor='green'
      >
        {message('project.importAction')}
      </Button>
    </Stack>
  )
}
