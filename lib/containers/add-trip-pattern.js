// @flow
import {connect} from 'react-redux'

import AddTripPattern from '../components/modification/add-trip-pattern'
import selectAddTripsGTFSStops from '../selectors/add-trips-gtfs-stops'
import selectAllPhaseFromTimetableStops
  from '../selectors/all-phase-from-timetable-stops'
import selectExtendFromEnd from '../selectors/extend-from-end'
import selectNumberOfStops from '../selectors/number-of-stops'
import selectQualifiedStops from '../selectors/qualified-stops-from-segments'
import selectScenarioTimetables from '../selectors/scenario-timetables'
import selectSegmentDistances from '../selectors/segment-distances'

import type {Modification} from '../types'

function mapStateToProps (
  state: any,
  ownProps: {modification: Modification}
): any {
  return {
    allPhaseFromTimetableStops: selectAllPhaseFromTimetableStops(
      state,
      ownProps
    ),
    extendFromEnd: selectExtendFromEnd(state, ownProps),
    gtfsStops: selectAddTripsGTFSStops(state, ownProps),
    mapState: state.mapState,
    numberOfStops: selectNumberOfStops(state, ownProps),
    qualifiedStops: selectQualifiedStops(state, ownProps),
    scenarioTimetables: selectScenarioTimetables(state, ownProps),
    segmentDistances: selectSegmentDistances(state, ownProps)
  }
}

export default connect(mapStateToProps)(AddTripPattern)
