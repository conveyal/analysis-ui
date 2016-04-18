import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {setProject} from './actions'
import {Button} from './components/buttons'
import {Text} from './components/input'
import Modal from './components/modal'
import {getProject} from './project-store'
import transitDataSource from './transit-data-source'

function mapStateToProps (state) {
  return {
    projects: state.scenario.projects
  }
}

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(push('/')),
    setProject: (project) => dispatch(setProject(project))
  }
}

class SelectProject extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
    setProject: PropTypes.func.isRequired
  }

  state = {
    newProjectName: ''
  }

  createNewProject = () => {
    const modifications = new Map()
    this.props.setProject({
      id: uuid.v4(),
      name: this.state.newProjectName,
      modifications: new Map(),
      variants: ['Default']
    })
    transitDataSource.getDataForModifications({ modifications: [...modifications.values()] })
    this.props.close()
  }

  selectProject = (e) => {
    e.preventDefault()
    getProject(e.target.getAttribute('data-project'))
      .then((p) => {
        transitDataSource.getDataForModifications({ modifications: [...p.modifications.values()], bundleId: p.bundleId })
        this.props.setProject(p)
      })
    this.props.close()
  }

  updateNewProjectName = (e) => {
    this.setState(Object.assign({}, this.state, { newProjectName: e.target.value }))
  }

  render () {
    const {projects} = this.props
    const {newProjectName} = this.state
    const projectsList = projects.map((project) => {
      const name = project.name && project.name.length > 0 ? project.name : <i>(no name)</i>
      return (
        <li key={project.id}>
          <a href='#'
            data-project={project.id}
            onClick={this.selectProject}
            >{name}</a>
        </li>
      )
    })

    return (
      <Modal
        onClose={this.props.close}
        >
        <legend>Open Project</legend>
        <ul>{projectsList}</ul>

        <form>
          <legend>Create Project</legend>
          <Text
            name='Project Name'
            onChange={this.updateNewProjectName}
            value={newProjectName} />
          <Button style='success' onClick={this.createNewProject}>Create</Button> <Button style='danger' onClick={this.props.close}>Cancel</Button>
        </form>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectProject)
