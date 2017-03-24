import {connect} from 'react-redux'

import {setActiveTrips} from '../actions'
import {setMapState} from '../actions/map'
import {deleteModification, setAndRetrieveData} from '../actions/modifications'
import ModificationEditor from '../components/modification/editor'
import selectLastStopDistance from '../selectors/last-stop-distance-from-start'
import selectModificationFeed from '../selectors/modification-feed'
import selectModificationIsLoaded from '../selectors/modification-is-loaded'
import selectNumberOfStops from '../selectors/number-of-stops'
import selectRoutePatterns from '../selectors/route-patterns'
import selectRouteStops from '../selectors/route-stops'
import selectSegmentDistances from '../selectors/segment-distances'
import selectSelectedStops from '../selectors/selected-stops'
import selectStopsFromModification from '../selectors/stops-from-modification'

function mapStateToProps (state, props) {
  const {mapState, scenario} = state
  const {modification} = props
  return {
    allVariants: scenario.variants,
    bundleId: scenario.currentScenario.bundleId,
    isLoaded: selectModificationIsLoaded(state, props),
    lastStopDistanceFromStart: selectLastStopDistance(state, props),
    modification: modification,
    name: modification.name,
    numberOfStops: selectNumberOfStops(state, props),
    segmentDistances: selectSegmentDistances(state, props),
    routePatterns: selectRoutePatterns(state, props),
    routeStops: selectRouteStops(state, props),
    selectedFeed: selectModificationFeed(state, props),
    selectedStops: selectSelectedStops(state, props),
    stops: selectStopsFromModification(state, props),
    type: modification.type,
    variants: modification.variants,

    // For sub-components
    feeds: scenario.feeds,
    mapState
  }
}

function mapDispatchToProps (dispatch, {
  modification
}) {
  return {
    remove: () => dispatch(deleteModification(modification.id)),
    replace: (opts) => dispatch(setAndRetrieveData(opts)),

    // for sub-components
    setActiveTrips: (opts) => dispatch(setActiveTrips(opts)),
    setMapState: (opts) => dispatch(setMapState(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModificationEditor)
