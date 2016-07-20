import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import Select from 'react-select'

import {create} from './actions/project'
import {Button} from './components/buttons'
import {Group} from './components/input'
import {Body} from './components/panel'

function mapStateToProps ({
  project
}) {
  return {
    projects: project.projects
  }
}

function mapDispatchToProps (dispatch) {
  return {
    create: () => dispatch(create()),
    push: (url) => dispatch(push(url))
  }
}

class SelectProject extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
    push: PropTypes.func.isRequired
  }

  render () {
    const {create, projects, push} = this.props
    return (
      <Body>
        <Group>
          <Select
            options={projects.map((project) => { return {value: project.id, label: project.name} })}
            onChange={(option) => push(`/projects/${option.value}`)}
            placeholder='Select a project...'
            />
        </Group>
        <Button
          block
          onClick={create}
          style='success'
          >Create a new project
        </Button>
      </Body>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectProject)
