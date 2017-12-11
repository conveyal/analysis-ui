// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addComponent} from '../actions/map'
import {getForProject as loadModifications} from '../actions/modifications'
import {
  deleteProject,
  downloadVariant,
  load,
  set
} from '../actions/project'
import {SINGLE_POINT_ANALYSIS_COMPONENT} from '../constants/map'
import Project from '../components/project'

import selectBundle from '../selectors/current-bundle'
import selectProject from '../selectors/current-project'
import selectProjectId from '../selectors/current-project-id'
import selectModifications from '../selectors/modifications'

function mapStateToProps (state, props) {
  const project = selectProject(state, props)
  return {
    _id: selectProjectId(state, props),
    bundle: selectBundle(state, props),
    modifications: selectModifications(state, props),
    project
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    addComponentToMap: () =>
      dispatch(addComponent(SINGLE_POINT_ANALYSIS_COMPONENT)),
    deleteProject: () =>
      dispatch([deleteProject(ownProps.params.projectId), push('/')]),
    setCurrentProject: project => dispatch(set(project)),
    downloadVariant: index => dispatch(downloadVariant(index)),
    load: id => dispatch(load(id)),
    loadModifications: opts => dispatch(loadModifications(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Project)
