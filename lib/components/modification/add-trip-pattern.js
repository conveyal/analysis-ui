//
import React from 'react'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'

/**
 * Display an add trip pattern modification
 */
export const AddTripPattern = ({
  allPhaseFromTimetableStops,
  extendFromEnd,
  gtfsStops,
  allStops,
  mapState,
  modification,
  numberOfStops,
  qualifiedStops,
  projectTimetables,
  segmentDistances,
  setMapState,
  update
}) => (
  <div>
    <EditAlignment
      extendFromEnd={extendFromEnd}
      mapState={mapState}
      modification={modification}
      numberOfStops={numberOfStops}
      segmentDistances={segmentDistances}
      setMapState={setMapState}
      allStops={allStops}
      update={update}
      disabled={false}
    />

    <Timetables
      allPhaseFromTimetableStops={allPhaseFromTimetableStops}
      bidirectional={modification.bidirectional}
      modificationStops={gtfsStops}
      numberOfStops={numberOfStops}
      qualifiedStops={qualifiedStops}
      projectTimetables={projectTimetables}
      segmentDistances={segmentDistances}
      setMapState={setMapState}
      timetables={modification.timetables}
      update={update}
    />
  </div>
)
