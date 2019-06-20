import React from 'react'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'

/**
 * Display an add trip pattern modification
 */
export default function AddTripPattern(p) {
  return (
    <>
      <EditAlignment
        allStops={p.allStops}
        mapState={p.mapState}
        modification={p.modification}
        numberOfStops={p.numberOfStops}
        segmentDistances={p.segmentDistances}
        setMapState={p.setMapState}
        update={p.update}
        disabled={false}
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
