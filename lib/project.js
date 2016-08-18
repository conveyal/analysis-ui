import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {load} from './actions/project'
import DeepEqualComponent from './components/deep-equal'
import Icon from './components/icon'

function mapStateToProps ({
  project,
  scenario
}, {
  params
}) {
  const currentProject = project.projectsById[params.projectId] || {}
  return {
    description: currentProject.description,
    id: params.projectId,
    name: currentProject.name
  }
}

function mapDispatchToProps (dispatch, props) {
  const {projectId} = props.params
  return {
    load: () => dispatch(load(projectId))
  }
}

class Project extends DeepEqualComponent {
  static propTypes = {
    children: PropTypes.any,
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    name: PropTypes.string
  }

  componentWillMount () {
    const {id, load} = this.props
    load(id)
  }

  componentWillReceiveProps (newProps) {
    const {id, load} = this.props
    const isNewProjectId = id !== newProps.id
    if (isNewProjectId) load()
  }

  render () {
    const {children, id, name} = this.props
    return (
      <div>
        <div
          className='ProjectTitle'
          ><Icon type='list' />
          <Link
            to={`/projects/${id}`}
            ><span>{name}</span>
          </Link>
          <Link
            className='pull-right'
            to={`/projects/${id}/edit`}
            ><Icon type='pencil' />
          </Link>
        </div>
        {children}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Project)
