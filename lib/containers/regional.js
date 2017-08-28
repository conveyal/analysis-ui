import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import Regional from '../components/analysis/regional'
import selectActiveRegionalAnalysis from '../selectors/active-regional-analysis'
import selectCurrentScenario from '../selectors/current-scenario'
import selectCurrentScenarioId from '../selectors/current-scenario-id'
import selectRegionalAnalyses from '../selectors/regional-analyses'

import {
  load,
  deleteRegionalAnalysis
} from '../actions/analysis/regional'

function mapStateToProps (state, ownProps) {
  return {
    activeAnalysis: selectActiveRegionalAnalysis(state, ownProps),
    allAnalyses: selectRegionalAnalyses(state, ownProps)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    loadAllAnalyses: () => dispatch((dispatch, getState) => {
      const currentScenario = selectCurrentScenario(getState(), ownProps)
      dispatch(load(currentScenario.projectId))
    }),
    deleteAnalysis: (analysisId) => dispatch(deleteRegionalAnalysis(analysisId)),
    goToAnalysis: (analysisId) => dispatch((dispatch, getState) => {
      const scenarioId = selectCurrentScenarioId(getState(), ownProps)
      dispatch(push(`/scenarios/${scenarioId}/regional/${analysisId}`))
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Regional)
