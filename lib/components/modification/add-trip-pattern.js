// @flow
import React, {Component} from 'react'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'

import type {MapState, Modification, Timetable} from '../../types'

type Props = {
  allPhaseFromTimetableStops: any,
  extendFromEnd: boolean,
  gtfsStops: any[],
  mapState: MapState,
  modification: Modification,
  numberOfStops: number,
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
          scenarioTimetables={scenarioTimetables}
          segmentDistances={segmentDistances}
          timetables={modification.timetables}
          update={update}
          />
      </div>
    )
  }
}
