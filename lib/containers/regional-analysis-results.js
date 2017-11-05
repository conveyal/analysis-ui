// @flow
import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {
  deleteRegionalAnalysis,
  load,
  loadRegionalAnalysisGrids,
  setActiveRegionalAnalyses,
  setMinimumImprovementProbability,
  setAggregationArea,
  setAggregationWeights,
  uploadAggregationArea
} from '../actions/analysis/regional'
import {addComponent, removeComponent} from '../actions/map'
import RegionalAnalysis from '../components/analysis/regional-results'
import {
  REGIONAL_COMPONENT,
  REGIONAL_COMPARISON_COMPONENT,
  ISOCHRONE_COMPONENT,
  OPPORTUNITY_COMPONENT,
  AGGREGATION_AREA_COMPONENT
} from '../constants/map'
import selectActiveRegionalAnalysis from '../selectors/active-regional-analysis'
import selectAggregateAccessibility from '../selectors/aggregate-accessibility'
import selectComparisonAggregateAccessibility
  from '../selectors/comparison-aggregate-accessibility'
import selectCurrentScenarioId from '../selectors/current-scenario-id'

function mapStateToProps (state, ownProps) {
  const {project, analysis} = state

  return {
    analysis: selectActiveRegionalAnalysis(state, ownProps),
    analysisId: ownProps.params.regionalAnalysisId,
    regionalAnalyses: project.regionalAnalyses,
    scenarioId: selectCurrentScenarioId(state, ownProps),
    projectId: project.currentProject._id,
    comparisonAnalysis: project.regionalAnalyses != null
      ? project.regionalAnalyses.find(
          a => a._id === analysis.regional.comparisonId
        )
      : null,
    minimumImprovementProbability: analysis.regional
      .minimumImprovementProbability,
    grid: analysis.regional.grid,
    differenceGrid: analysis.regional.differenceGrid,
    breaks: analysis.regional.breaks,
    opportunityDatasets: project.currentProject.opportunityDatasets,
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

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    addRegionalAnalysisLayerToMap: () =>
      dispatch(addComponent(REGIONAL_COMPONENT)),
    addRegionalComparisonLayerToMap: () =>
      dispatch(addComponent(REGIONAL_COMPARISON_COMPONENT)),
    addAggregationAreaComponentToMap: () =>
      dispatch(addComponent(AGGREGATION_AREA_COMPONENT)),
    deleteAnalysis: (analysisId, scenarioId) => dispatch([
      deleteRegionalAnalysis(analysisId),
      push(`/scenarios/${scenarioId}/regional`)
    ]),
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
    setActiveRegionalAnalysis: ({_id, comparisonId}) =>
      dispatch([
        setActiveRegionalAnalyses({_id, comparisonId}),
        loadRegionalAnalysisGrids({_id, comparisonId})
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
