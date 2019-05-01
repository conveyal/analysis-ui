import Router from 'next/router'
import {connect} from 'react-redux'

import {deleteProject, saveToServer} from '../actions/project'
import EditProject from '../components/edit-project'
import {RouteTo} from '../constants'
import selectCurrentBundle from '../selectors/current-bundle'
import selectCurrentProject from '../selectors/current-project'

function mapStateToProps(state, props) {
  const currentProject = selectCurrentProject(state, props)
  const currentBundle = selectCurrentBundle(state, props) || {}
  return {
    bundleName: currentBundle.name,
    project: currentProject
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const {projectId, regionId} = ownProps.query
  return {
    close: () =>
      Router.push({
        pathname: RouteTo.modifications,
        query: {projectId, regionId}
      }),
    deleteProject: () => dispatch(deleteProject(projectId, regionId)),
    save: opts => dispatch(saveToServer(opts))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProject)
