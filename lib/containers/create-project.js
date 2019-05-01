import Router from 'next/router'
import {connect} from 'react-redux'

import {create} from '../actions/project'
import CreateProject from '../components/create-project'
import {RouteTo} from '../constants'
import selectBundlesReady from '../selectors/bundles-ready'

function mapStateToProps(state, ownProps) {
  return {
    bundles: selectBundlesReady(state, ownProps)
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const regionId = ownProps.query.regionId
  return {
    create: opts => dispatch(create({...opts, regionId})),
    goToCreateBundle: () =>
      Router.push({
        pathname: RouteTo.bundleCreate,
        query: {regionId}
      })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProject)
