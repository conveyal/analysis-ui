import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {push} from 'react-router-redux'

import {load} from './actions/project'
import {Button} from './components/buttons'
import DeepEqualComponent from './components/deep-equal'
import DockContentTitle from './components/dock-content-title'
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
    name: currentProject.name,
    scenarios: scenario.scenarios
  }
}

function mapDispatchToProps (dispatch, props) {
  const {projectId} = props.params
  return {
    edit: () => dispatch(push(`/projects/${projectId}/edit`)),
    load: () => dispatch(load(projectId))
  }
}

class Project extends DeepEqualComponent {
  static propTypes = {
    children: PropTypes.any,
    description: PropTypes.string,
    edit: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    name: PropTypes.string,
    scenarios: PropTypes.array.isRequired
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

  _edit = () => {
    this.props.edit()
  }

  render () {
    const {children, id, name} = this.props
    return (
      <div>
        <DockContentTitle>
          <Link to={`/projects/${id}`}><Icon type='database' /> {name}</Link>
          <Button
            className='pull-right'
            onClick={this._edit}
            ><Icon type='pencil' />
          </Button>
        </DockContentTitle>
        {children}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Project)
