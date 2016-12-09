import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import {Group} from './input'
import {Body} from './panel'

export default class SelectProject extends Component {
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
        <Button
          block
          onClick={() => push(`/projects/create`)}
          style='success'
          >Create a new project
        </Button>
      </Body>
    )
  }
}
