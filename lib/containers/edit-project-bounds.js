import {connect} from 'react-redux'

import {setLocally} from '../actions/project'
import EditProjectBounds from '../components/map/edit-project-bounds'

function mapStateToProps ({project}, {projectId}) {
  const currentProject = project.projectsById[projectId] || {}
  return {
    bounds: currentProject.bounds || {},
    isLoaded: !!currentProject.bounds,
    project: currentProject
  }
}

function mapDispatchToProps (dispatch) {
  return {
    saveLocally: project => dispatch(setLocally(project))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProjectBounds)
