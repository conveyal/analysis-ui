// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {deleteBundle, saveBundle} from '../actions'
import EditBundle from '../components/edit-bundle'
import selectBundles from '../selectors/bundles'

function mapStateToProps(state, ownProps) {
  const bundleId = ownProps.query.bundleId
  const bundles = selectBundles(state, ownProps)
  const bundle = bundles.find(b => b._id === bundleId)
  return {
    bundle,
    bundles,
    isLoaded: !!bundle
  }
}

function mapDispatchToProps(dispatch: Dispatch, ownProps) {
  const {bundleId, regionId} = ownProps.query
  return {
    goToCreateBundle: () =>
      dispatch(push(`/regions/${regionId}/bundles/create`)),
    goToEditBundle: bundleId =>
      dispatch(push(`/regions/${regionId}/bundles/${bundleId}`)),
    deleteBundle: () => [
      dispatch(deleteBundle(bundleId)),
      dispatch(push(`/regions/${regionId}/bundles`))
    ],
    saveBundle: bundle => dispatch(saveBundle(bundle))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBundle)
