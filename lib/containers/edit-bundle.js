import Router from 'next/router'
import {connect} from 'react-redux'

import {deleteBundle, saveBundle} from '../actions'
import {PATHS} from '../constants'
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

function mapDispatchToProps(dispatch, ownProps) {
  const {bundleId, regionId} = ownProps.query
  return {
    goToCreateBundle: () =>
      Router.push({
        pathname: PATHS.bundleCreate,
        query: {regionId}
      }),
    goToEditBundle: bundleId =>
      Router.push({
        pathname: PATHS.bundleEdit,
        query: {regionId, bundleId}
      }),
    deleteBundle: () => {
      dispatch(deleteBundle(bundleId))
      Router.push({
        pathname: PATHS.bundles,
        query: {regionId}
      })
    },
    saveBundle: bundle => dispatch(saveBundle(bundle))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBundle)
