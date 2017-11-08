// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {deleteBundle, saveBundle} from '../actions'
import EditBundle from '../components/edit-bundle'

function mapStateToProps (state, ownProps) {
  const bundleId = ownProps.params.bundleId
  const isLoaded = bundleId === undefined
    ? true
    : state.scenario.bundles.find(bundle => bundle._id === bundleId)
  return {
    bundle: state.scenario.bundles
      .find(b => b._id === bundleId),
    bundles: state.scenario.bundles,
    isLoaded
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  const {bundleId, projectId} = ownProps.params
  return {
    goToCreateBundle: () =>
      dispatch(push(`/projects/${projectId}/bundles/create`)),
    goToEditBundle: bundleId =>
      dispatch(push(`/projects/${projectId}/bundles/${bundleId}`)),
    deleteBundle: () => [
      dispatch(deleteBundle(bundleId)),
      dispatch(push(`/projects/${projectId}/bundles`))
    ],
    saveBundle: (bundle) => dispatch(saveBundle(bundle))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBundle)
