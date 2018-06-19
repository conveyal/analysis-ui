// @flow
import get from 'lodash/get'
import {connect} from 'react-redux'

import {
  fetchTravelTimeSurface,
  setDestination,
  setProfileRequest
} from '../actions/analysis'
import {addComponent, removeComponent} from '../actions/map'
import Isochrone from '../components/map/isochrone'
import {
  ISOCHRONE_COMPONENT,
  DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT
} from '../constants/map'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  const pr = get(state, 'analysis.profileRequest')

  return {
    comparisonIsochrone: select.comparisonIsochrone(state),
    comparisonInProgress: select.comparisonInProgress(state),
    isochrone: select.isochrone(state),
    isochroneCutoff: select.maxTripDurationMinutes(state, props),
    isochroneLonLat: pr.fromLat && pr.fromLon ? {lon: pr.fromLon, lat: pr.fromLat} : null,
    isochroneIsStale: select.profileRequestHasChanged(state, props),

    isDestinationTravelTimeDistributionComponentOnMap: state.mapState.components.includes(
      DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT
    )
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    setIsochroneLonLat: lonlat => {
      dispatch(setProfileRequest({fromLat: lonlat.lat, fromLon: lonlat.lon}))
      dispatch(fetchTravelTimeSurface(false))
    },
    remove: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    addDestinationTravelTimeDistributionComponentToMap: () =>
      dispatch(addComponent(DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT)),
    removeDestinationTravelTimeDistributionComponentFromMap: () =>
      dispatch(removeComponent(DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT)),
    setDestination: destination => dispatch(setDestination(destination))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Isochrone)
