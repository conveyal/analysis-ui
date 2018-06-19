// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {create} from '../actions/project'
import EditProject from '../components/edit-project'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  return {
    bundles: select.bundlesReady(state, props),
    regionId: select.currentRegionId(state, props)
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    create: opts => dispatch(create(opts)),
    goToCreateBundle: regionId =>
      dispatch(push(`/regions/${regionId}/bundles/create`))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
