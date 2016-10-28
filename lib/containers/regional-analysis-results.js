import RegionalAnalysisResults from '../components/analysis/regional'
import {load, setActiveRegionalAnalyses, loadRegionalAnalysisGrids, setMinimumImprovementProbability} from '../actions/analysis/regional'
import {addComponent, removeComponent} from '../actions/map'
import {REGIONAL_COMPONENT, REGIONAL_COMPARISON_COMPONENT, ISOCHRONE_COMPONENT, OPPORTUNITY_COMPONENT} from '../constants/map'
import {connect} from 'react-redux'

function mapStateToProps (state) {
  const { project, analysis, mapState } = state

  return {
    regionalAnalyses: project.regionalAnalyses,
    projectId: project.currentProject.id,
    activeRegionalAnalysis: analysis.regional.id,
    comparisonRegionalAnalysis: analysis.regional.comparisonId,
    regionalAnalysisLayerOnMap: mapState.components.indexOf(REGIONAL_COMPONENT) > -1,
    regionalComparisonLayerOnMap: mapState.components.indexOf(REGIONAL_COMPARISON_COMPONENT) > -1,
    minimumImprovementProbability: analysis.regional.minimumImprovementProbability
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    load: (projectId) => dispatch(load(projectId)),
    setActiveRegionalAnalysis: ({ id, comparisonId, percentile }) => dispatch([
      setActiveRegionalAnalyses({ id, comparisonId }),
      loadRegionalAnalysisGrids({ id, comparisonId, percentile })
    ]),
    setMinimumImprovementProbability: (p) => dispatch(setMinimumImprovementProbability(p)),
    addRegionalAnalysisLayerToMap: () => dispatch(addComponent(REGIONAL_COMPONENT)),
    removeRegionalAnalysisLayerFromMap: () => dispatch(removeComponent(REGIONAL_COMPONENT)),
    addRegionalComparisonLayerToMap: () => dispatch(addComponent(REGIONAL_COMPARISON_COMPONENT)),
    removeRegionalComparisonLayerFromMap: () => dispatch(removeComponent(REGIONAL_COMPARISON_COMPONENT)),
    removeIsochroneLayerFromMap: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    removeOpportunityLayerFromMap: () => dispatch(removeComponent(OPPORTUNITY_COMPONENT)),
    addOpportunityLayerToMap: () => dispatch(addComponent(OPPORTUNITY_COMPONENT))
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { load, ...otherDispatch } = dispatchProps
  const { projectId } = stateProps
  return {
    ...ownProps,
    ...stateProps,
    ...otherDispatch,
    // TODO performance implications of binding an action creator in mergeProps?
    load: () => load(projectId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(RegionalAnalysisResults)
