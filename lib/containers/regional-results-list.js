// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import RegionalResultsList from '../components/analysis/regional-results-list'
import * as select from '../selectors'

import {
  load,
  deleteRegionalAnalysis,
  setActiveRegionalAnalyses
} from '../actions/analysis/regional'

function mapStateToProps (state, ownProps) {
  return {
    allAnalyses: select.regionalAnalyses(state, ownProps)
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    loadAllAnalyses: () =>
      dispatch((dispatch, getState) => {
        const currentProject = select.currentProject(getState(), ownProps)
        if (currentProject) {
          dispatch(load(currentProject.regionId))
        }
      }),
    deleteAnalysis: analysisId => dispatch(deleteRegionalAnalysis(analysisId)),
    goToAnalysis: analysisId =>
      dispatch((dispatch, getState) => {
        const projectId = select.currentProjectId(getState(), ownProps)
        dispatch([
          setActiveRegionalAnalyses({_id: analysisId}),
          push(`/projects/${projectId}/regional/${analysisId}`)
        ])
      }),
    goToSinglePointAnalysisPage: () =>
      dispatch((dispatch, getState) => {
        const projectId = select.currentProjectId(getState(), ownProps)
        dispatch(push(`/projects/${projectId}/analysis`))
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalResultsList)
