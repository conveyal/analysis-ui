// @flow
import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'

import {addComponent, removeComponent, setCenter} from '../actions/map'
import {
  create,
  deleteLocally,
  deleteProject,
  load,
  save,
  setLocally
} from '../actions/project'
import EditProject from '../components/edit-project'
import {EDIT_PROJECT_BOUNDS_COMPONENT} from '../constants/map'
import {CREATING_ID, DEFAULT_BOUNDS} from '../constants/project'

import selectCurrentProject from '../selectors/current-project'

function mapStateToProps (state, ownProps) {
  const project = selectCurrentProject(state, ownProps)
  return {
    project: project || {
      _id: CREATING_ID,
      bounds: DEFAULT_BOUNDS
    }
  }
}

function mapDispatchToProps (dispatch: Dispatch, {params}) {
  return {
    addComponentToMap: () =>
      dispatch(addComponent(EDIT_PROJECT_BOUNDS_COMPONENT)),
    create: opts => dispatch(create(opts)),
    clearUncreatedProject: () => dispatch(deleteLocally(CREATING_ID)),
    deleteProject: () => dispatch(deleteProject(params.projectId)),
    fetch: opts => dispatch(fetch(opts)),
    removeComponentFromMap: () =>
      dispatch(removeComponent(EDIT_PROJECT_BOUNDS_COMPONENT)),
    save: opts => dispatch(save(opts)),
    setCenter: c => dispatch(setCenter(c)),
    setLocally: p => dispatch(setLocally(p)),
    load: _id => dispatch(load(_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
