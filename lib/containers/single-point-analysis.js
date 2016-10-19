import { connect } from 'react-redux'
import { ISOCHRONE_COMPONENT, OPPORTUNITY_COMPONENT } from '../constants/map'
import SinglePointAnalysis from '../components/analysis'
import {fetchIsochrone, setIsochroneCutoff, setCurrentIndicator, enterAnalysisMode, exitAnalysisMode, setActiveVariant, clearIsochroneResults} from '../actions/analysis'
import {addComponent, removeComponent} from '../actions/map'

function mapStateToProps (state, params) {
  const {analysis, mapState, scenario, project} = state
  const variantId = parseInt(params.params.variantId)
  return {
    bundleId: scenario.currentBundle ? scenario.currentBundle.id : null,
    isochroneCutoff: analysis.isochroneCutoff || 60,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isShowingIsochrone: mapState.components.indexOf(ISOCHRONE_COMPONENT) !== -1,
    isShowingOpportunities: mapState.components.indexOf(OPPORTUNITY_COMPONENT) !== -1,
    // TODO duplicate code below and in containers/isochrone
    isochroneLatLng: analysis.isochroneLatLng || state.mapState.center,
    modifications: scenario.modifications.filter(m => m.variants[variantId]),
    scenarioId: scenario.currentScenario ? scenario.currentScenario.id : null,
    variantIndex: variantId,
    accessibility: analysis.accessibility,
    indicators: project.currentProject.indicators,
    spectrogramData: analysis.spectrogramData,
    currentIndicator: analysis.currentIndicator
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    addOpportunityLayerToMap: () => dispatch(addComponent(OPPORTUNITY_COMPONENT)),
    fetchIsochrone: (opts) => dispatch(fetchIsochrone(opts)),
    removeIsochroneLayerFromMap: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    removeOpportunityLayerFromMap: () => dispatch(removeComponent(OPPORTUNITY_COMPONENT)),
    setIsochroneCutoff: (cutoffSec) => dispatch(setIsochroneCutoff(cutoffSec)),
    setCurrentIndicator: (indicator) => dispatch(setCurrentIndicator(indicator)),
    enterAnalysisMode: () => dispatch(enterAnalysisMode()),
    exitAnalysisMode: () => dispatch(exitAnalysisMode()),
    setActiveVariant: (v) => dispatch(setActiveVariant(v)),
    clearIsochroneResults: () => dispatch(clearIsochroneResults())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
