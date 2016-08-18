import {connect} from 'react-redux'
import {goBack} from 'react-router-redux'

import {addBundle, deleteBundle, saveBundle} from '../actions'
import EditBundle from '../components/edit-bundle'

function mapStateToProps (state, props) {
  const {params} = props
  const {bundleId, projectId} = params
  const bundle = state.scenario.bundlesById[bundleId]
  return {
    bundle,
    bundleId,
    name: bundle && bundle.name,
    projectId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    addBundle: (...args) => dispatch(addBundle(...args)),
    deleteBundle: () => [dispatch(deleteBundle(props.params.bundleId)), dispatch(goBack())],
    saveBundle: (...args) => dispatch(saveBundle(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBundle)
