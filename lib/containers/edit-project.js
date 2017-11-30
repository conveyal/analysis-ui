// @flow
import {connect} from 'react-redux'
import {goBack, push} from 'react-router-redux'

import {create, deleteProject, saveToServer} from '../actions/project'
import EditProject from '../components/edit-project'

import selectBundle from '../selectors/current-bundle'
import selectRegionId from '../selectors/current-region-id'
import selectProject from '../selectors/current-project'
import selectProjectId from '../selectors/current-project-id'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  const _id = selectProjectId(state, props)
  const currentProject = selectProject(state, props) || {}
  const currentBundle = selectBundle(state, props) || {}
  return {
    bundles: state.project.bundles,
    bundleId: currentBundle._id,
    bundleName: currentBundle.name,
    _id,
    isEditing: !!_id,
    name: currentProject.name,
    variants: selectVariants(state, props),
    regionId: selectRegionId(state, props),
    project: currentProject
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    close: () => dispatch(goBack()),
    create: opts => dispatch(create(opts)),
    deleteProject: ({projectId, regionId}) =>
      dispatch([deleteProject(projectId), push(`/regions/${regionId}`)]),
    goToCreateBundle: regionId =>
      dispatch(push(`/regions/${regionId}/bundles/create`)),
    save: opts => dispatch(saveToServer(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
