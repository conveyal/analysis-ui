import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {push} from 'react-router-redux'
import Select from 'react-select'

import {Group} from './components/input'
import {Body} from './components/panel'

function mapStateToProps ({
  project
}) {
  return {
    projects: project.projects
  }
}

class SelectProject extends Component {
  static propTypes = {
    projects: PropTypes.array.isRequired,
    push: PropTypes.func.isRequired
  }

  render () {
    const {projects, push} = this.props
    return (
      <Body>
        <Group>
          <Select
            options={projects.map((project) => { return {value: project.id, label: project.name} })}
            onChange={(option) => push(`/projects/${option.value}`)}
            placeholder='Select a project...'
            />
        </Group>
        <Link to='/projects/create'>Create a new project</Link>
      </Body>
    )
  }
}

export default connect(mapStateToProps, {push})(SelectProject)
