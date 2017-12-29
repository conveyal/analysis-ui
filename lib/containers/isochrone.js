// @flow
import {connect} from 'react-redux'

import {
  fetchTravelTimeSurface,
  setIsochroneLonLat,
  setDestination
} from '../actions/analysis'
import {addComponent, removeComponent} from '../actions/map'
import Isochrone from '../components/map/isochrone'
import {
  ISOCHRONE_COMPONENT,
  DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT
} from '../constants/map'
import selectIsochrone from '../selectors/isochrone'
import selectComparisonIsochrone from '../selectors/comparison-isochrone'
import selectComparisonInProgress from '../selectors/comparison-in-progress'
import get from '../utils/get'

function mapStateToProps (state, props) {
  const {analysis, mapState} = state
  return {
    comparisonIsochrone: selectComparisonIsochrone(state),
    comparisonInProgress: selectComparisonInProgress(state),
    isFetchingIsochrone: !!analysis.isFetchingIsochrone,
    isochrone: selectIsochrone(state),
    isochroneCutoff: get(state, 'analysis.profileRequest.maxTripDurationMinutes', 60),
    isochroneLonLat: analysis.isochroneLonLat || state.mapState.center,

    isDestinationTravelTimeDistributionComponentOnMap: mapState.components.includes(
      DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT
    )
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    fetchTravelTimeSurface: () => dispatch(fetchTravelTimeSurface(false)),
    setIsochroneLonLat: lonlat => dispatch(setIsochroneLonLat(lonlat)),
    remove: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    addDestinationTravelTimeDistributionComponentToMap: () =>
      dispatch(addComponent(DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT)),
    removeDestinationTravelTimeDistributionComponentFromMap: () =>
      dispatch(removeComponent(DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT)),
    setDestination: destination => dispatch(setDestination(destination))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Isochrone)
