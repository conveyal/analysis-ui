import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addBundle} from '../actions'
import CreateBundle from '../components/create-bundle'

function mapStateToProps (state, props) {
  const {scenario} = state
  const {params} = props
  const {bundleId, projectId} = params
  const {bundles} = scenario
  const bundle = bundles.find(b => b._id === bundleId)
  return {
    bundle,
    bundleId,
    name: bundle && bundle.name,
    projectId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    addBundle: (...args) => [
      dispatch(addBundle(...args)),
      dispatch(push(`/projects/${props.params.projectId}/bundles`))
    ],
    fetch: opts => dispatch(fetch(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBundle)
