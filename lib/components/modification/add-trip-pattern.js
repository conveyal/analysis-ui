import React from 'react'

import {Text} from '../input'
import TransitModeSelector from '../transit-mode-selector'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'

/**
 * Display an add trip pattern modification
 */
export default function AddTripPattern(p) {
  return (
    <>
      <TransitModeSelector
        onChange={transitMode => p.update({transitMode})}
        value={p.modification.transitMode}
      />

      <Text
        label='Route Color'
        help='For display purposes (ex: with Taui). Must be a 6-digit hexadecimal number.'
        onChange={e => p.update({color: e.currentTarget.value})}
        value={p.modification.color}
      />

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
        allPhaseFromTimetableStops={p.allPhaseFromTimetableStops}
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
    </>
  )
}
