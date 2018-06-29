// @flow
import get from 'lodash/get'
import {connect} from 'react-redux'

import {
  fetchTravelTimeSurface,
  setDestination,
  setProfileRequest
} from '../actions/analysis'
import Isochrone from '../components/map/isochrone'
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
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    setIsochroneLonLat: lonlat => {
      dispatch(setProfileRequest({fromLat: lonlat.lat, fromLon: lonlat.lon}))
      dispatch(fetchTravelTimeSurface(false))
    },
    setDestination: destination => dispatch(setDestination(destination))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Isochrone)
