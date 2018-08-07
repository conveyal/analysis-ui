// @flow
import {connect} from 'react-redux'
import {goBack} from 'react-router-redux'

import {deleteProject, saveToServer} from '../actions/project'
import EditProject from '../components/edit-project'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  const currentProject = select.currentProject(state, props)
  const currentBundle = select.currentBundle(state, props) || {}
  return {
    bundleName: currentBundle.name,
    project: currentProject
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    close: () => dispatch(goBack()),
    deleteProject: () => dispatch(deleteProject(props.params.projectId, props.params.regionId)),
    save: opts => dispatch(saveToServer(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
