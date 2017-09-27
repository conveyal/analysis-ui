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
    bundleId: currentBundle ? currentBundle.id : null,
    comparisonBundleId: analysis.comparisonBundleId,
    comparisonScenarioId: analysis.comparisonScenarioId,
    comparisonVariant: analysis.comparisonVariant,
    currentIndicator: analysis.currentIndicator,
    destinationGrid: analysis.destinationGrid,
    indicators: project.currentProject.indicators,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isochroneFetchStatusMessage: analysis.isochroneFetchStatusMessage,
    isochroneLonLat: analysis.isochroneLonLat || state.mapState.center,
    isShowingIsochrone: mapState.components.indexOf(ISOCHRONE_COMPONENT) !== -1,
    isShowingOpportunities: mapState.components.indexOf(
      OPPORTUNITY_COMPONENT
    ) !== -1,
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
    variantIndex: variantId,
    variantName: scenario.currentScenario.variants[variantId],
    variants: scenario.currentScenario.variants,
    workerVersion: project.currentProject.r5Version
  }
}

const addEditRegionalAnalysisBoundsLayerToMap = () =>
  addComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)
const addIsochroneLayerToMap = () => addComponent(ISOCHRONE_COMPONENT)
const addOpportunityLayerToMap = () => addComponent(OPPORTUNITY_COMPONENT)
const removeEditRegionalAnalysisBoundsLayerFromMap = () =>
  removeComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)
const removeIsochroneLayerFromMap = () => removeComponent(ISOCHRONE_COMPONENT)
const removeOpportunityLayerFromMap = () =>
  removeComponent(OPPORTUNITY_COMPONENT)

const mapDispatchToProps = {
  addEditRegionalAnalysisBoundsLayerToMap,
  addIsochroneLayerToMap,
  addOpportunityLayerToMap,
  clearComparisonScenario,
  clearIsochroneResults,
  createRegionalAnalysis,
  enterAnalysisMode,
  exitAnalysisMode,
  fetchTravelTimeSurface,
  push,
  removeEditRegionalAnalysisBoundsLayerFromMap,
  removeIsochroneLayerFromMap,
  removeOpportunityLayerFromMap,
  setActiveVariant,
  setComparisonScenario,
  setCurrentIndicator,
  setProfileRequest,
  setRegionalAnalysisBounds
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
