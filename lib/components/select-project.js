// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

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
        <Group>
          <Button
            block
            onClick={() => push(`/projects/create`)}
            style='success'
            ><Icon type='cubes' /> Create a new Project
          </Button>
        </Group>
        {projects.length > 0 &&
          <div>
            <p style={{textAlign: 'center'}}>or go to an existing project</p>
            {projects.map((project) =>
              <Link
                className='BlockLink'
                key={project.id}
                to={`/projects/${project.id}`}
                title='Go to Project'
                ><Icon type='cubes' /> {project.name}
              </Link>)}
          </div>}
      </Body>
    )
  }
}
