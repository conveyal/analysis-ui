import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addComponent, removeComponent, setCenter} from '../actions/map'
import {deleteProject, save, load} from '../actions/project'
import EditProject from '../components/edit-project'
import {EDIT_PROJECT_BOUNDS_COMPONENT} from '../constants/map'
import {setLocally} from '../actions/project'

function mapStateToProps ({
  project
}, {
  params
}) {
  const id = params.projectId
  const currentProject = project.projectsById[id] || {}
  return {
    bounds: currentProject.bounds,
    description: currentProject.description,
    id,
    isEditing: !!id,
    name: currentProject.name,
    r5Version: currentProject.r5Version
  }
}

function mapDispatchToProps (dispatch, {
  params
}) {
  return {
    addComponentToMap: () => dispatch(addComponent(EDIT_PROJECT_BOUNDS_COMPONENT)),
    deleteProject: () => dispatch(deleteProject(params.projectId)),
    removeComponentFromMap: () => dispatch(removeComponent(EDIT_PROJECT_BOUNDS_COMPONENT)),
    save: (opts) => dispatch([save(opts), push(`/projects/${params.projectId}`)]),
    setCenter: (c) => dispatch(setCenter(c)),
    setLocally: (p) => dispatch(setLocally(p)),
    load: (id) => dispatch(load(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
