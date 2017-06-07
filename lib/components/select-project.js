// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import {Group} from './input'
import {Body} from './panel'

type Props = {
  loadAllProjects(): void,
  projects: Array<{id: string, name: string}>,
  push(string): void
}

export default class SelectProject extends Component<void, Props, void> {
  componentDidMount () {
    this.props.loadAllProjects()
  }

  render () {
    const {projects, push} = this.props
    return (
      <Body>
        <div className='WelcomeTitle'>
          <p style={{textAlign: 'center'}}>welcome to</p>
          <span className='logo' to='/'>conveyal analysis </span>
          <span className='badge'>beta</span>
        </div>
        {projects.length > 0 &&
          <div>
            <Group>
              <Select
                options={projects.map((project) => { return {value: project.id, label: project.name} })}
                onChange={(option) => push(`/projects/${option.value}`)}
                placeholder='Select an existing project...'
                />
            </Group>
            <p style={{textAlign: 'center'}}>or</p>
          </div>}
        <Button
          block
          onClick={() => push(`/projects/create`)}
          style='success'
          ><Icon type='plus' /> Create a new project
        </Button>
      </Body>
    )
  }
}
