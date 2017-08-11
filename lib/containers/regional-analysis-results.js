import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'

import {
  load,
  loadRegionalAnalysisGrids,
  setActiveRegionalAnalyses,
  setMinimumImprovementProbability,
  setAggregationArea,
  setAggregationWeights,
  uploadAggregationArea
} from '../actions/analysis/regional'
import {addComponent, removeComponent} from '../actions/map'
import RegionalAnalysis from '../components/analysis/regional'
import {
  REGIONAL_COMPONENT,
  REGIONAL_COMPARISON_COMPONENT,
  ISOCHRONE_COMPONENT,
  OPPORTUNITY_COMPONENT,
  AGGREGATION_AREA_COMPONENT
} from '../constants/map'
import selectAggregateAccessibility from '../selectors/aggregate-accessibility'
import selectComparisonAggregateAccessibility from '../selectors/comparison-aggregate-accessibility'

function mapStateToProps (state, ownProps) {
  const {project, analysis} = state
  const {regionalAnalysisId} = ownProps.params

  return {
    regionalAnalyses: project.regionalAnalyses,
    projectId: project.currentProject.id,
    analysisId: regionalAnalysisId, // needed so we can request grids before analyses have loaded when deep linking
    analysis:
      project.regionalAnalyses != null
        ? project.regionalAnalyses.find(a => a.id === regionalAnalysisId)
        : null,
    comparisonAnalysis:
      project.regionalAnalyses != null
        ? project.regionalAnalyses.find(
            a => a.id === analysis.regional.comparisonId
          )
        : null,
    minimumImprovementProbability:
      analysis.regional.minimumImprovementProbability,
    grid: analysis.regional.grid,
    differenceGrid: analysis.regional.differenceGrid,
    breaks: analysis.regional.breaks,
    indicators: project.currentProject.indicators,
    aggregationAreas: project.currentProject.aggregationAreas,
    aggregationAreaUploading: analysis.regional.aggregationAreaUploading,
    aggregationAreaId: analysis.regional.aggregationAreaId,
    aggregationWeightsId: analysis.regional.aggregationWeightsId,
    aggregateAccessibility: selectAggregateAccessibility(state),
    comparisonAggregateAccessibility: selectComparisonAggregateAccessibility(
      state
    )
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    addRegionalAnalysisLayerToMap: () =>
      dispatch(addComponent(REGIONAL_COMPONENT)),
    addRegionalComparisonLayerToMap: () =>
      dispatch(addComponent(REGIONAL_COMPARISON_COMPONENT)),
    addAggregationAreaComponentToMap: () =>
      dispatch(addComponent(AGGREGATION_AREA_COMPONENT)),
    removeAggregationAreaComponentFromMap: () =>
      dispatch(removeComponent(AGGREGATION_AREA_COMPONENT)),
    addIsochroneLayerToMap: () => dispatch(addComponent(ISOCHRONE_COMPONENT)),
    addOpportunityLayerToMap: () =>
      dispatch(addComponent(OPPORTUNITY_COMPONENT)),
    fetch: opts => dispatch(fetch(opts)),
    loadRegionalAnalyses: projectId => dispatch(load(projectId)),
    removeRegionalAnalysisLayerFromMap: () =>
      dispatch(removeComponent(REGIONAL_COMPONENT)),
    removeRegionalComparisonLayerFromMap: () =>
      dispatch(removeComponent(REGIONAL_COMPARISON_COMPONENT)),
    removeIsochroneLayerFromMap: () =>
      dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    removeOpportunityLayerFromMap: () =>
      dispatch(removeComponent(OPPORTUNITY_COMPONENT)),
    setActiveRegionalAnalysis: ({id, comparisonId}) =>
      dispatch([
        setActiveRegionalAnalyses({id, comparisonId}),
        loadRegionalAnalysisGrids({id, comparisonId})
      ]),
    setMinimumImprovementProbability: p =>
      dispatch(setMinimumImprovementProbability(p)),
    setAggregationArea: ({projectId, aggregationAreaId}) =>
      dispatch(setAggregationArea({projectId, aggregationAreaId})),
    setAggregationWeights: ({projectId, aggregationWeightsId}) =>
      dispatch(setAggregationWeights({projectId, aggregationWeightsId})),
    uploadAggregationArea: ({name, files, projectId}) =>
      dispatch(uploadAggregationArea({name, files, projectId}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalAnalysis)
