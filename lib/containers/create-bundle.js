import Router from 'next/router'
import {connect} from 'react-redux'

import {addBundle} from '../actions'
import CreateBundle from '../components/create-bundle'
import {RouteTo} from '../constants'
import fetch from '../fetch-action'

function mapDispatchToProps(dispatch, ownProps) {
  const {regionId} = ownProps.query
  return {
    addBundle: (...args) => {
      dispatch(addBundle(...args))
      Router.push({
        pathname: RouteTo.bundles,
        query: {regionId}
      })
    },
    fetch: opts => dispatch(fetch(opts))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(CreateBundle)
