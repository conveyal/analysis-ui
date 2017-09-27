import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import Bundles from '../components/bundles'

function mapStateToProps (state, props) {
  const isLoaded = props.params.bundleId === undefined
    ? true
    : state.scenario.bundles.find(bundle => bundle.id === props.params.bundleId)
  return {
    bundles: state.scenario.bundles,
    isLoaded,
    selectedBundleId: props.params.bundleId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    goToCreateBundle: () =>
      dispatch(push(`/projects/${props.params.projectId}/bundles/create`)),
    goToEditBundle: bundleId =>
      dispatch(push(`/projects/${props.params.projectId}/bundles/${bundleId}`))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bundles)
