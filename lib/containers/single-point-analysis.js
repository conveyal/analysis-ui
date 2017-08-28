import {connect} from 'react-redux'
import {
  ISOCHRONE_COMPONENT,
  OPPORTUNITY_COMPONENT,
  EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT
} from '../constants/map'
import {push} from 'react-router-redux'
import SinglePointAnalysis from '../components/analysis'
import {
  fetchTravelTimeSurface,
  clearComparisonScenario,
  setComparisonScenario,
  setIsochroneCutoff,
  setCurrentIndicator,
  enterAnalysisMode,
  exitAnalysisMode,
  setActiveVariant,
  clearIsochroneResults,
  setProfileRequest
} from '../actions/analysis'
import {
  createRegionalAnalysis,
  setRegionalAnalysisBounds
} from '../actions/analysis/regional'
import {addComponent, removeComponent} from '../actions/map'
import accessibility from '../selectors/accessibility'
import comparisonAccessibility from '../selectors/comparison-accessibility'
import percentileCurves from '../selectors/percentile-curves'
import comparisonPercentileCurves from '../selectors/comparison-percentile-curves'
import comparisonInProgress from '../selectors/comparison-in-progress'
import selectCurrentBundle from '../selectors/current-bundle'
import selectRegionalAnalyses from '../selectors/regional-analyses'

function mapStateToProps (state, ownProps) {
  const {analysis, mapState, scenario, project} = state
  const parsedVariantId = parseInt(ownProps.params.variantId)
  const variantId = isNaN(parsedVariantId)
    ? analysis.activeVariant || 0
    : parsedVariantId
  const scenarioId = scenario.currentScenario
    ? scenario.currentScenario.id
    : null

  const currentBundle = selectCurrentBundle(state, ownProps)
  return {
    // TODO duplicate code below and in containers/isochrone
    accessibility: accessibility(state, ownProps),
    bundleId: currentBundle ? currentBundle.id : null,
    comparisonAccessibility: comparisonAccessibility(state, ownProps),
    comparisonBundleId: analysis.comparisonBundleId,
    comparisonInProgress: comparisonInProgress(state),
    comparisonModifications: analysis.comparisonModifications,
    comparisonScenarioId: analysis.comparisonScenarioId,
    comparisonPercentileCurves: comparisonPercentileCurves(state, ownProps),
    comparisonVariant: analysis.comparisonVariant,
    currentIndicator: analysis.currentIndicator,
    destinationGrid: analysis.destinationGrid,
    indicators: project.currentProject.indicators,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isochroneCutoff: analysis.isochroneCutoff || 60,
    isochroneFetchStatusMessage: analysis.isochroneFetchStatusMessage,
    isochroneLonLat: analysis.isochroneLonLat || state.mapState.center,
    isShowingIsochrone: mapState.components.indexOf(ISOCHRONE_COMPONENT) !== -1,
    isShowingOpportunities:
      mapState.components.indexOf(OPPORTUNITY_COMPONENT) !== -1,
    modifications: scenario.modifications.filter(m => m.variants[variantId]),
    profileRequest: analysis.profileRequest,
    projectId: project.currentProject.id,
    regionalAnalyses: selectRegionalAnalyses(state, ownProps),
    regionalAnalysisBounds: analysis.regional.bounds,
    projectBounds: project.currentProject.bounds,
    scenarioApplicationErrors: analysis.scenarioApplicationErrors,
    scenarioApplicationWarnings: analysis.scenarioApplicationWarnings,
    scenarioId,
    scenarioName: scenario.currentScenario.name,
    scenarios: scenario.scenarios,
    percentileCurves: percentileCurves(state, ownProps),
    variantIndex: variantId,
    variantName: scenario.currentScenario.variants[variantId],
    variants: scenario.currentScenario.variants,
    workerVersion: project.currentProject.r5Version
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    clearComparisonScenario: () => dispatch(clearComparisonScenario()),
    clearIsochroneResults: () => dispatch(clearIsochroneResults()),
    enterAnalysisMode: () => dispatch(enterAnalysisMode()),
    exitAnalysisMode: () => dispatch(exitAnalysisMode()),
    fetchTravelTimeSurface: opts =>
      dispatch(
        fetchTravelTimeSurface({
          ...opts,
          dispatch
        })
      ),
    push: url => dispatch(push(url)),
    addEditRegionalAnalysisBoundsLayerToMap: () =>
      dispatch(addComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)),
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    addOpportunityLayerToMap: () =>
      dispatch(addComponent(OPPORTUNITY_COMPONENT)),
    removeEditRegionalAnalysisBoundsLayerFromMap: () =>
      dispatch(removeComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)),
    removeIsochroneLayerFromMap: () =>
      dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    removeOpportunityLayerFromMap: () =>
      dispatch(removeComponent(OPPORTUNITY_COMPONENT)),
    createRegionalAnalysis: request => dispatch(createRegionalAnalysis(request)),
    setActiveVariant: v => dispatch(setActiveVariant(v)),
    setComparisonScenario: ({id, bundleId}, variantIndex) =>
      dispatch(setComparisonScenario({id, bundleId, variantIndex})),
    setCurrentIndicator: (projectId, indicator) =>
      dispatch(setCurrentIndicator(projectId, indicator)),
    setIsochroneCutoff: cutoffSec => dispatch(setIsochroneCutoff(cutoffSec)),
    setProfileRequest: profileRequest =>
      dispatch(setProfileRequest(profileRequest)),
    setRegionalAnalysisBounds: bounds =>
      dispatch(setRegionalAnalysisBounds(bounds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
