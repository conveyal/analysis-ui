/** display an add trip pattern modification */

import React, {PropTypes, PureComponent} from 'react'

import EditAlignment from './edit-alignment'
import Timetables from './timetables'

export default class AddTripPattern extends PureComponent {
  static propTypes = {
    allPhaseFromTimetableStops: PropTypes.object.isRequired,
    extendFromEnd: PropTypes.bool.isRequired,
    gtfsStops: PropTypes.array.isRequired,
    mapState: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    numberOfStops: PropTypes.number.isRequired,
    scenarioTimetables: PropTypes.array,
    segmentDistances: PropTypes.array.isRequired,

    // actions
    setMapState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

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
