import {connect} from 'react-redux'

import {load} from '../actions/project'
import Project from '../components/project'
import r5VersionUnsupported from '../selectors/r5-version-unsupported'

function mapStateToProps (state, {
  params
}) {
  const { project } = state
  const currentProject = project.projectsById[params.projectId]
  const isLoaded = !!currentProject
  return {
    description: isLoaded ? currentProject.description : '',
    id: params.projectId,
    isLoaded,
    name: isLoaded ? currentProject.name : '',
    r5VersionUnsupported: r5VersionUnsupported(state)
  }
}

function mapDispatchToProps (dispatch, props) {
  const {projectId} = props.params
  return {
    load: () => dispatch(load(projectId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Project)
