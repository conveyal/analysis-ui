import fetch from '../fetch-action'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import {connect} from 'react-redux'

import {
  loadRegionalAnalysisGrids,
  setActiveRegionalAnalyses,
  updateRegionalAnalysis
} from 'lib/actions/analysis/regional'
import * as select from 'lib/selectors'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'

const RegionalAnalysis = dynamic(
  () => import('lib/components/analysis/regional'),
  {
    ssr: false
  }
)

function mapStateToProps(state, ownProps) {
  return {
    comparisonAnalysis: select.comparisonRegionalAnalysis(state, ownProps),
    comparisonAnalyses: select.comparisonAnalyses(state, ownProps),
    origin: get(state, 'analysis.regional.origin'),
    grid: get(state, 'analysis.regional.grid'),
    differenceGrid: get(state, 'analysis.regional.differenceGrid'),
    breaks: get(state, 'analysis.regional.breaks'),
    aggregationWeightsId: get(activeOpportunityDataset(state, ownProps), '_id'),
    aggregateAccessibility: select.aggregateAccessibility(state),
    comparisonAggregateAccessibility: select.comparisonAggregateAccessibility(
      state
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: opts => dispatch(fetch(opts)),
    loadRegionalAnalysisGrids: ids => dispatch(loadRegionalAnalysisGrids(ids)),
    setActiveRegionalAnalysis: ({_id, comparisonId}) =>
      dispatch(setActiveRegionalAnalyses({_id, comparisonId})),
    updateRegionalAnalysis: a => dispatch(updateRegionalAnalysis(a))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalAnalysis)
