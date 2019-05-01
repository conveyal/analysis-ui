import Router from 'next/router'
import {connect} from 'react-redux'

import RegionalResultsList from '../components/analysis/regional-results-list'
import {RouteTo} from '../constants'
import * as select from '../selectors'
import {
  load,
  deleteRegionalAnalysis,
  setActiveRegionalAnalyses
} from '../actions/analysis/regional'

function mapStateToProps(state, ownProps) {
  return {
    allAnalyses: select.regionalAnalyses(state, ownProps),
    regionId: select.currentRegionId(state, ownProps)
  }
}

function mapDispatchToProps(dispatch: Dispatch, ownProps) {
  return {
    loadAllAnalyses: regionId => dispatch(load(regionId)),
    deleteAnalysis: analysisId => dispatch(deleteRegionalAnalysis(analysisId)),
    goToAnalysis: ({analysisId, regionId}) => {
      dispatch(setActiveRegionalAnalyses({_id: analysisId}))
      Router.push({
        pathname: RouteTo.regionalAnalysis,
        query: {analysisId, regionId}
      })
    },
    goToSinglePointAnalysisPage: regionId =>
      Router.push({
        pathname: RouteTo.analysis,
        query: {regionId}
      })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionalResultsList)
