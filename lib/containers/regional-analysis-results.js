// @flow
import fetch from '@conveyal/woonerf/fetch'
import get from 'lodash/get'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {
  deleteRegionalAnalysis,
  load,
  loadRegionalAnalysisGrids,
  setActiveRegionalAnalyses,
  setMinimumImprovementProbability,
  setAggregationArea,
  updateRegionalAnalysis,
  uploadAggregationArea
} from '../actions/analysis/regional'
import RegionalAnalysis from '../components/analysis/regional'
import * as select from '../selectors'
import {activeOpportunityDataset, opportunityDatasets} from '../modules/opportunity-datasets/selectors'

function mapStateToProps (state, ownProps) {
  const regionId = select.currentRegionId(state, ownProps)
  const region = select.currentRegion(state, ownProps)
  const od = activeOpportunityDataset(state, ownProps)
  return {
    analysis: select.activeRegionalAnalysis(state, ownProps),
    analysisId: ownProps.params.regionalAnalysisId,
    regionalAnalyses: state.region.regionalAnalyses,
    regionId,
    comparisonAnalysis: select.comparisonRegionalAnalysis(state, ownProps),
    minimumImprovementProbability: get(state, 'analysis.regional.minimumImprovementProbability'),
    origin: get(state, 'analysis.regional.origin'),
    grid: get(state, 'analysis.regional.grid'),
    differenceGrid: get(state, 'analysis.regional.differenceGrid'),
    breaks: get(state, 'analysis.regional.breaks'),
    opportunityDatasets: opportunityDatasets(state, ownProps),
    aggregationAreas: get(region, 'aggregationAreas'),
    aggregationAreaUploading: get(state, 'analysis.regional.aggregationAreaUploading'),
    aggregationAreaId: get(state, 'analysis.regional.aggregationAreaId'),
    aggregationWeightsId: od && od._id,
    aggregateAccessibility: select.aggregateAccessibility(state),
    comparisonAggregateAccessibility: select.comparisonAggregateAccessibility(
      state
    )
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    deleteAnalysis: (analysis) => dispatch([
      deleteRegionalAnalysis(analysis._id),
      push(`/regions/${analysis.regionId}/regional`)
    ]),
    fetch: opts => dispatch(fetch(opts)),
    loadRegionalAnalyses: regionId => dispatch(load(regionId)),
    loadRegionalAnalysisGrids: (ids) =>
      dispatch(loadRegionalAnalysisGrids(ids)),
    setActiveRegionalAnalysis: ({_id, comparisonId}) =>
      dispatch(setActiveRegionalAnalyses({_id, comparisonId})),
    setMinimumImprovementProbability: p =>
      dispatch(setMinimumImprovementProbability(p)),
    setAggregationArea: (opts) => dispatch(setAggregationArea(opts)),
    updateRegionalAnalysis: (a) =>
      dispatch(updateRegionalAnalysis(a)),
    uploadAggregationArea: ({name, files, regionId}) =>
      dispatch(uploadAggregationArea({name, files, regionId}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalAnalysis)
