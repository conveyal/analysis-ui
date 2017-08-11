// @flow
import {connect} from 'react-redux'

import {setActiveTrips} from '../actions'
import ConvertToFrequency from '../components/modification/convert-to-frequency'
import selectAllPhaseFromTimetableStops from '../selectors/all-phase-from-timetable-stops'
import selectFullyQualifiedRouteStops from '../selectors/fully-qualified-route-stops'
import selectRoutePatterns from '../selectors/route-patterns'
import selectScenarioTimetables from '../selectors/scenario-timetables'
import selectModificationFeed from '../selectors/modification-feed'

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
    feeds: state.scenario.feeds,
    fullyQualifiedRouteStops: selectFullyQualifiedRouteStops(state, ownProps),
    routePatterns: selectRoutePatterns(state, ownProps),
    scenarioTimetables: selectScenarioTimetables(state, ownProps),
    selectedFeed: selectModificationFeed(state, ownProps)
  }
}

export default connect(mapStateToProps, {setActiveTrips})(ConvertToFrequency)
