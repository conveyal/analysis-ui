import {connect} from 'react-redux'

import {fetchIsochrone, setIsochroneCutoff} from '../actions/analysis'
import {addComponent, removeComponent, setCenter} from '../actions/map'
import MapControl from '../components/map/control'
import {ISOCHRONE_COMPONENT} from '../constants/map'

function mapStateToProps (state, props) {
  const {analysis, mapState, scenario} = state
  return {
    bundleId: scenario.bundleId,
    center: mapState.center,
    geocoderApiKey: process.env.MAPZEN_SEARCH_KEY,
    isochroneCutoff: analysis.isochroneCutoff,
    isochroneLatLng: analysis.isochroneLatLng,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isShowingIsochrone: mapState.components.indexOf(ISOCHRONE_COMPONENT) !== -1,
    modifications: scenario.modifications,
    scenarioId: scenario.scenarioId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    fetchIsochrone: (opts) => dispatch(fetchIsochrone(opts)),
    removeIsochroneLayerFromMap: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    setIsochroneCutoff: (cutoffSec) => dispatch(setIsochroneCutoff(cutoffSec)),
    setMapCenter: (center) => dispatch(setCenter(center))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapControl)
