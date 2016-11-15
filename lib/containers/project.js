import {connect} from 'react-redux'

import {load} from '../actions/project'
import Project from '../components/project'

function mapStateToProps ({
  project,
  scenario
}, {
  params
}) {
  const currentProject = project.projectsById[params.projectId]
  const isLoaded = !!currentProject
  return {
    description: isLoaded ? currentProject.description : '',
    id: params.projectId,
    isLoaded,
    name: isLoaded ? currentProject.name : ''
  }
}

function mapDispatchToProps (dispatch, props) {
  const {projectId} = props.params
  return {
    load: () => dispatch(load(projectId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Project)
