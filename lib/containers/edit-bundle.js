// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {deleteBundle, saveBundle} from '../actions'
import EditBundle from '../components/edit-bundle'

function mapStateToProps (state, ownProps) {
  const bundleId = ownProps.params.bundleId
  return {
    bundle: state.scenario.bundles
      .find(b => b.id === bundleId),
    bundleId
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    deleteBundle: () => [
      dispatch(deleteBundle(props.params.bundleId)),
      dispatch(push(`/projects/${props.params.projectId}/bundles`))
    ],
    saveBundle: (bundle) => dispatch(saveBundle(bundle))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBundle)
