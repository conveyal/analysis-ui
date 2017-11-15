import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addBundle} from '../actions'
import CreateBundle from '../components/create-bundle'

function mapStateToProps (state, props) {
  const {project} = state
  const {params} = props
  const {bundleId, regionId} = params
  const {bundles} = project
  const bundle = bundles.find(b => b._id === bundleId)
  return {
    bundle,
    bundleId,
    name: bundle && bundle.name,
    regionId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    addBundle: (...args) => [
      dispatch(addBundle(...args)),
      dispatch(push(`/regions/${props.params.regionId}/bundles`))
    ],
    fetch: opts => dispatch(fetch(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBundle)
