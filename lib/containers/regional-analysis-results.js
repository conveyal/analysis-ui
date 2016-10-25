import RegionalAnalysisResults from '../components/analysis/regional'
import {load} from '../actions/analysis/regional'
import {connect} from 'react-redux'

function mapStateToProps (state) {
  const { project } = state

  return {
    regionalAnalyses: project.regionalAnalyses,
    projectId: project.currentProject.id
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    load: (projectId) => dispatch(load(projectId))
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { load, ...otherDispatch } = dispatchProps
  const { projectId } = stateProps
  return {
    ...ownProps,
    ...stateProps,
    ...otherDispatch,
    // TODO performance implications of binding an action creator in mergeProps?
    load: () => load(projectId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(RegionalAnalysisResults)
