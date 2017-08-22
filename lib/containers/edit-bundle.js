import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addBundle, deleteBundle, saveBundle} from '../actions'
import EditBundle from '../components/edit-bundle'

function mapStateToProps (state, props) {
  const {params} = props
  const {bundleId, projectId} = params
  const bundle = state.scenario.bundles.find(b => b.id === bundleId)
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
      dispatch(push(`/projects/${props.params.projectId}/scenarios/create`))
    ],
    deleteBundle: () => [
      dispatch(deleteBundle(props.params.bundleId)),
      dispatch(push(`/projects/${props.params.projectId}`))
    ],
    fetch: opts => dispatch(fetch(opts)),
    saveBundle: (...args) => dispatch(saveBundle(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBundle)
