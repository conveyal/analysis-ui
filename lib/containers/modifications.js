import Router from 'next/router'
import {connect} from 'react-redux'

import {
  create as createModification,
  update as updateModification
} from '../actions/modifications'
import Modifications from '../components/modification/list'
import {RouteTo} from '../constants'
import selectBundleId from '../selectors/bundle-id'
import selectModifications from '../selectors/modifications'
import selectModificationsByType from '../selectors/modifications-by-type'
import selectVariants from '../selectors/variants'

function mapStateToProps(state, ownProps) {
  const {projectId, regionId} = ownProps.query
  return {
    bundleId: selectBundleId(state, ownProps),
    modifications: selectModifications(state, ownProps),
    modificationsByType: selectModificationsByType(state, ownProps),
    regionId,
    projectId,
    variants: selectVariants(state, ownProps)
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const {projectId, regionId} = ownProps.query
  return {
    createModification: opts => dispatch(createModification(opts)),
    goToEditModification: modificationId =>
      Router.push({
        pathname: RouteTo.modificationEdit,
        query: {
          modificationId,
          projectId,
          regionId
        }
      }),
    updateModification: opts => dispatch(updateModification(opts))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modifications)
