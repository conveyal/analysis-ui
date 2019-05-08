//
import fetch from '../fetch-action'
import get from 'lodash/get'
import Router from 'next/router'
import {connect} from 'react-redux'

import {
  deleteRegionalAnalysis,
  load,
  loadRegionalAnalysisGrids,
  setActiveRegionalAnalyses,
  setAggregationArea,
  updateRegionalAnalysis,
  uploadAggregationArea
} from '../actions/analysis/regional'
import RegionalAnalysis from '../components/analysis/regional'
import {RouteTo} from '../constants'
import * as select from '../selectors'
import {loadOpportunityDatasets} from '../modules/opportunity-datasets/actions'
import {
  activeOpportunityDataset,
  opportunityDatasets
} from '../modules/opportunity-datasets/selectors'

function mapStateToProps(state, ownProps) {
  const regionId = select.currentRegionId(state, ownProps)
  const region = select.currentRegion(state, ownProps)
  return {
    analysis: select.activeRegionalAnalysis(state, ownProps),
    analysisId: get(ownProps, 'params.regionalAnalysisId'),
    regionalAnalyses: get(state, 'region.regionalAnalyses'),
    regionId,
    comparisonAnalysis: select.comparisonRegionalAnalysis(state, ownProps),
    origin: get(state, 'analysis.regional.origin'),
    grid: get(state, 'analysis.regional.grid'),
    differenceGrid: get(state, 'analysis.regional.differenceGrid'),
    breaks: get(state, 'analysis.regional.breaks'),
    opportunityDatasets: opportunityDatasets(state, ownProps),
    aggregationAreas: get(region, 'aggregationAreas'),
    aggregationAreaUploading: get(
      state,
      'analysis.regional.aggregationAreaUploading'
    ),
    aggregationAreaId: get(state, 'analysis.regional.aggregationAreaId'),
    aggregationWeightsId: get(activeOpportunityDataset(state, ownProps), '_id'),
    aggregateAccessibility: select.aggregateAccessibility(state),
    comparisonAggregateAccessibility: select.comparisonAggregateAccessibility(
      state
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteAnalysis: analysis => {
      dispatch(deleteRegionalAnalysis(analysis._id))
      Router.push({
        pathname: RouteTo.regionalAnalyses,
        query: {regionId: analysis.regionId}
      })
    },
    fetch: opts => dispatch(fetch(opts)),
    loadOpportunityDatasets: () => dispatch(loadOpportunityDatasets()),
    loadRegionalAnalyses: regionId => dispatch(load(regionId)),
    loadRegionalAnalysisGrids: ids => dispatch(loadRegionalAnalysisGrids(ids)),
    setActiveRegionalAnalysis: ({_id, comparisonId}) =>
      dispatch(setActiveRegionalAnalyses({_id, comparisonId})),
    setAggregationArea: opts => dispatch(setAggregationArea(opts)),
    updateRegionalAnalysis: a => dispatch(updateRegionalAnalysis(a)),
    uploadAggregationArea: ({name, files, regionId}) =>
      dispatch(uploadAggregationArea({name, files, regionId}))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionalAnalysis)
