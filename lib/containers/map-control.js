import {connect} from 'react-redux'

import {fetchIsochrone, setIsochroneCutoff} from '../actions/analysis'
import {addComponent, removeComponent, setCenter} from '../actions/map'
import MapControl from '../components/map/control'
import {ISOCHRONE_COMPONENT, OPPORTUNITY_COMPONENT} from '../constants/map'

function mapStateToProps (state, props) {
  const {analysis, mapState, scenario} = state
  return {
    bundleId: scenario.currentBundle ? scenario.currentBundle.id : null,
    center: mapState.center,
    geocoderApiKey: process.env.MAPZEN_SEARCH_KEY,
    isochroneCutoff: analysis.isochroneCutoff,
    // TODO duplicate code below and in containers/isochrone
    isochroneLonLat: analysis.isochroneLonLat || state.mapState.center,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isShowingIsochrone: mapState.components.indexOf(ISOCHRONE_COMPONENT) !== -1,
    modifications: scenario.modifications,
    scenarioId: scenario.currentScenario ? scenario.currentScenario.id : null,
    accessibility: analysis.accessibility
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    addOpportunityLayerToMap: () =>
      dispatch(addComponent(OPPORTUNITY_COMPONENT)),
    fetchIsochrone: opts => dispatch(fetchIsochrone(opts)),
    removeIsochroneLayerFromMap: () =>
      dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    removeOpportunityLayerFromMap: () =>
      dispatch(removeComponent(OPPORTUNITY_COMPONENT)),
    setIsochroneCutoff: cutoffSec => dispatch(setIsochroneCutoff(cutoffSec)),
    setMapCenter: center => dispatch(setCenter(center))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapControl)
