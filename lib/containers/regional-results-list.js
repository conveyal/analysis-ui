import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import RegionalResultsList from '../components/analysis/regional-results-list'
import selectCurrentScenario from '../selectors/current-scenario'
import selectCurrentScenarioId from '../selectors/current-scenario-id'
import selectRegionalAnalyses from '../selectors/regional-analyses'

import {
  load,
  deleteRegionalAnalysis,
  setActiveRegionalAnalyses
} from '../actions/analysis/regional'

function mapStateToProps (state, ownProps) {
  return {
    allAnalyses: selectRegionalAnalyses(state, ownProps)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    loadAllAnalyses: () =>
      dispatch((dispatch, getState) => {
        const currentScenario = selectCurrentScenario(getState(), ownProps)
        dispatch(load(currentScenario.regionId))
      }),
    deleteAnalysis: analysisId => dispatch(deleteRegionalAnalysis(analysisId)),
    goToAnalysis: analysisId =>
      dispatch((dispatch, getState) => {
        const scenarioId = selectCurrentScenarioId(getState(), ownProps)
        dispatch([
          setActiveRegionalAnalyses({_id: analysisId}),
          push(`/scenarios/${scenarioId}/regional/${analysisId}`)
        ])
      }),
    goToSinglePointAnalysisPage: () =>
      dispatch((dispatch, getState) => {
        const scenarioId = selectCurrentScenarioId(getState(), ownProps)
        dispatch(push(`/scenarios/${scenarioId}/analysis`))
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalResultsList)
