import {connect} from 'react-redux'

import {clearIsochroneResults, setIsochroneCutoff, setIsochroneLatLng} from '../actions/analysis'
import {addComponent, removeComponent, setCenter} from '../actions/map'
import MapControl from '../components/map/control'
import {ISOCHRONE_COMPONENT} from '../constants/map'

function mapStateToProps (state, props) {
  return {
    center: state.mapState.center,
    geocoderApiKey: process.env.MAPZEN_SEARCH_KEY,
    isochroneCutoff: state.analysis.isochroneCutoff,
    isochroneLatLng: state.analysis.isochroneLatLng,
    isFetchingIsochrone: state.analysis.isFetchingIsochrone,
    isShowingIsochrone: state.mapState.components.indexOf(ISOCHRONE_COMPONENT) !== -1
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    clearIsochroneResults: () => dispatch(clearIsochroneResults()),
    removeIsochroneLayerFromMap: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    setIsochroneCutoff: (cutoffSec) => dispatch(setIsochroneCutoff(cutoffSec)),
    setIsochroneLatLng: (latlng) => dispatch(setIsochroneLatLng(latlng)),
    setMapCenter: (center) => dispatch(setCenter(center))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapControl)
