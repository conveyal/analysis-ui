import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack
} from '@chakra-ui/core'
import get from 'lodash/get'
import dynamic from 'next/dynamic'

import TransitModeSelector from '../transit-mode-selector'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'
import {MAP_STATE_TRANSIT_EDITOR} from '../../constants'

const MapLayer = dynamic(() =>
  import('../modifications-map/add-trip-pattern-layer')
)

const blogLink =
  'https://blog.conveyal.com/upgraded-outreach-serverless-transit-accessibility-with-taui-f90d6d51e177'
const colorHelpText = `For display purposes (ex: with <a href="${blogLink}" target="_blank">Taui</a>). Must be a 6-digit hexadecimal number.`

/**
 * Display an add trip pattern modification
 */
export default function AddTripPattern(p) {
  return (
    <Stack spacing={4}>
      {get(p, 'mapState.state') === MAP_STATE_TRANSIT_EDITOR ? null : (
        <MapLayer
          bidirectional={p.modification.bidirectional}
          segments={p.modification.segments}
        />
      )}

      <TransitModeSelector
        onChange={(transitMode) => p.update({transitMode})}
        value={p.modification.transitMode}
      />

      <FormControl className='DEV'>
        <FormLabel htmlFor='routeColor'>Route Color</FormLabel>
        <Input
          id='routeColor'
          onChange={(e) => p.update({color: e.currentTarget.value})}
          value={p.modification.color || ''}
        />
        <FormHelperText dangerouslySetInnerHTML={{__html: colorHelpText}} />
      </FormControl>

      <EditAlignment
        allStops={p.allStops}
        disabled={false}
        mapState={p.mapState}
        modification={p.modification}
        numberOfStops={p.numberOfStops}
        segmentDistances={p.segmentDistances}
        setMapState={p.setMapState}
        update={p.update}
      />

      <Timetables
        bidirectional={p.modification.bidirectional}
        modificationStops={p.gtfsStops}
        numberOfStops={p.numberOfStops}
        qualifiedStops={p.qualifiedStops}
        projectTimetables={p.projectTimetables}
        segmentDistances={p.segmentDistances}
        setMapState={p.setMapState}
        timetables={p.modification.timetables}
        update={p.update}
      />
    </Stack>
  )
}
