import { connect } from 'react-redux'
import { ISOCHRONE_COMPONENT, OPPORTUNITY_COMPONENT, EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT } from '../constants/map'
import { push } from 'react-router-redux'
import SinglePointAnalysis from '../components/analysis'
import {fetchIsochrone, setComparisonScenario, setComparisonInProgress, setIsochroneCutoff, setCurrentIndicator, enterAnalysisMode, exitAnalysisMode, setActiveVariant, clearIsochroneResults, setProfileRequest} from '../actions/analysis'
import {runAnalysis, load as loadRegionalAnalyses, deleteRegionalAnalysis, setRegionalAnalysisBounds} from '../actions/analysis/regional'
import {addComponent, removeComponent} from '../actions/map'

function mapStateToProps (state, params) {
  const {analysis, mapState, scenario, project} = state
  const variantId = parseInt(params.params.variantId)
  const scenarioId = scenario.currentScenario ? scenario.currentScenario.id : null
  return {
    // TODO duplicate code below and in containers/isochrone
    accessibility: analysis.accessibility,
    bundleId: scenario.currentBundle ? scenario.currentBundle.id : null,
    comparisonAccessibility: analysis.comparisonAccessibility,
    comparisonBundleId: analysis.comparisonBundleId,
    comparisonInProgress: analysis.comparisonInProgress,
    comparisonModifications: analysis.comparisonModifications,
    comparisonScenarioId: analysis.comparisonScenarioId,
    comparisonSpectrogramData: analysis.comparisonSpectrogramData,
    comparisonVariant: analysis.comparisonVariant,
    currentIndicator: analysis.currentIndicator,
    indicators: project.currentProject.indicators,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isochroneCutoff: analysis.isochroneCutoff || 60,
    isochroneFetchStatusMessage: analysis.isochroneFetchStatusMessage,
    isochroneLonLat: analysis.isochroneLonLat || state.mapState.center,
    isShowingIsochrone: mapState.components.indexOf(ISOCHRONE_COMPONENT) !== -1,
    isShowingOpportunities: mapState.components.indexOf(OPPORTUNITY_COMPONENT) !== -1,
    modifications: scenario.modifications.filter(m => m.variants[variantId]),
    profileRequest: analysis.profileRequest,
    projectId: project.currentProject.id,
    regionalAnalyses: project.regionalAnalyses != null
      ? project.regionalAnalyses.filter(a => a.scenarioId === scenarioId && a.variant === variantId && !a.deleted)
      : undefined,
    regionalAnalysisBounds: analysis.regional.bounds,
    projectBounds: project.currentProject.bounds,
    scenarioApplicationErrors: analysis.scenarioApplicationErrors,
    scenarioApplicationWarnings: analysis.scenarioApplicationWarnings,
    scenarioId,
    scenarioName: scenario.currentScenario.name,
    scenarios: scenario.scenarios,
    spectrogramData: analysis.spectrogramData,
    variantIndex: variantId,
    variantName: scenario.currentScenario.variants[variantId],
    workerVersion: project.currentProject.r5Version
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    clearIsochroneResults: () => dispatch(clearIsochroneResults()),
    deleteRegionalAnalysis: (analysisId) => dispatch(deleteRegionalAnalysis(analysisId)),
    enterAnalysisMode: () => dispatch(enterAnalysisMode()),
    exitAnalysisMode: () => dispatch(exitAnalysisMode()),
    fetchIsochrone: (opts) => dispatch(
      fetchIsochrone({
        ...opts,
        dispatch
      })),
    loadRegionalAnalyses: (projectId) => dispatch(loadRegionalAnalyses(projectId)),
    addEditRegionalAnalysisBoundsLayerToMap: () => dispatch(addComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)),
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    addOpportunityLayerToMap: () => dispatch(addComponent(OPPORTUNITY_COMPONENT)),
    removeEditRegionalAnalysisBoundsLayerFromMap: () => dispatch(removeComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)),
    removeIsochroneLayerFromMap: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    removeOpportunityLayerFromMap: () => dispatch(removeComponent(OPPORTUNITY_COMPONENT)),
    runAnalysis: (request) => dispatch(runAnalysis(request)),
    selectRegionalAnalysis: (projectId, scenarioId, regionalAnalysisId) =>
      dispatch(push(`/projects/${projectId}/scenarios/${scenarioId}/analysis/regional/${regionalAnalysisId}`)),
    setActiveVariant: (v) => dispatch(setActiveVariant(v)),
    setComparisonInProgress: (comparisonInProgress) => dispatch(setComparisonInProgress(comparisonInProgress)),
    setComparisonScenario: ({ id, bundleId }, variantIndex) => dispatch(setComparisonScenario({ id, bundleId, variantIndex })),
    setCurrentIndicator: (indicator) => dispatch(setCurrentIndicator(indicator)),
    setIsochroneCutoff: (cutoffSec) => dispatch(setIsochroneCutoff(cutoffSec)),
    setProfileRequest: (profileRequest) => dispatch(setProfileRequest(profileRequest)),
    setRegionalAnalysisBounds: (bounds) => dispatch(setRegionalAnalysisBounds(bounds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
