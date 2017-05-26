// @flow
import React, {Component} from 'react'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'

import type {GTFSStop, MapState, Modification, Stop, Timetable} from '../../types'

type Props = {
  allPhaseFromTimetableStops: any,
  extendFromEnd: boolean,
  gtfsStops: GTFSStop[],
  mapState: MapState,
  modification: Modification,
  numberOfStops: number,
  qualifiedStops: Stop[],
  scenarioTimetables: Timetable[],
  segmentDistances: number[],
  setMapState(MapState): void,
  update(any): void
}

/**
 * Display an add trip pattern modification
 */
export default class AddTripPattern extends Component<void, Props, void> {
  render () {
    const {
      allPhaseFromTimetableStops,
      extendFromEnd,
      gtfsStops,
      mapState,
      modification,
      numberOfStops,
      qualifiedStops,
      scenarioTimetables,
      segmentDistances,
      setMapState,
      update
    } = this.props

    return (
      <div>
        <EditAlignment
          extendFromEnd={extendFromEnd}
          mapState={mapState}
          modification={modification}
          setMapState={setMapState}
          update={update}
          />

        <Timetables
          allPhaseFromTimetableStops={allPhaseFromTimetableStops}
          bidirectional={modification.bidirectional}
          modificationStops={gtfsStops}
          numberOfStops={numberOfStops}
          qualifiedStops={qualifiedStops}
          scenarioTimetables={scenarioTimetables}
          segmentDistances={segmentDistances}
          setMapState={setMapState}
          timetables={modification.timetables}
          update={update}
          />
      </div>
    )
  }
}
