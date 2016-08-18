import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import {Group} from './input'
import {Body} from './panel'

export default class SelectProject extends Component {
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
