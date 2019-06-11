import fetch from '../fetch-action'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {connect} from 'react-redux'

import {
  deleteRegionalAnalysis,
  loadRegionalAnalysisGrids,
  setActiveRegionalAnalyses,
  setAggregationArea,
  updateRegionalAnalysis,
  uploadAggregationArea
} from 'lib/actions/analysis/regional'
import {RouteTo} from 'lib/constants'
import * as select from 'lib/selectors'
import {loadOpportunityDatasets} from 'lib/modules/opportunity-datasets/actions'
import {
  activeOpportunityDataset,
  opportunityDatasets
} from 'lib/modules/opportunity-datasets/selectors'

const RegionalAnalysis = dynamic(
  () => import('lib/components/analysis/regional'),
  {ssr: false}
)

function mapStateToProps(state, ownProps) {
  const region = select.currentRegion(state, ownProps)
  return {
    analysis: select.activeRegionalAnalysis(state, ownProps),
    comparisonAnalysis: select.comparisonRegionalAnalysis(state, ownProps),
    comparisonAnalyses: select.comparisonAnalyses(state, ownProps),
    origin: get(state, 'analysis.regional.origin'),
    grid: get(state, 'analysis.regional.grid'),
    differenceGrid: get(state, 'analysis.regional.differenceGrid'),
    breaks: get(state, 'analysis.regional.breaks'),
    opportunityDatasets: opportunityDatasets(state, ownProps),
    aggregationAreas: get(region, 'aggregationAreas'),
    aggregationAreaUploadInProgress: !!state.network.fetches.find(
      f => f.type === 'aggregation-area-upload'
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
        query: {regionId: Router.query.regionId}
      })
    },
    fetch: opts => dispatch(fetch(opts)),
    loadOpportunityDatasets: () => dispatch(loadOpportunityDatasets()),
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
