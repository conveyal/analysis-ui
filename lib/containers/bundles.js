import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import Bundles from '../components/bundles'

function mapStateToProps (state, props) {
  return {
    bundles: state.scenario.bundles
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    goToCreateBundle: () =>
      dispatch(push(`/projects/${props.params.projectId}/bundles/create`)),
    goToEditBundle: (bundleId) =>
      dispatch(push(`/projects/${props.params.projectId}/bundles/${bundleId}`))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bundles)
