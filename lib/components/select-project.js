// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import {Group} from './input'
import messages from '../utils/messages'

type Props = {
  loadAllProjects(): void,
  projects: Array<{_id: string, name: string}>,
  push(string): void
}

export default class SelectProject extends Component<void, Props, void> {
  componentDidMount () {
    this.props.loadAllProjects()
  }

  render () {
    const {projects, push} = this.props
    return (
      <InnerDock>
        <div className='WelcomeTitle'>
          <p style={{textAlign: 'center'}}>
            {messages.region.welcome}
          </p>
          <span className='logo' to='/'>
            conveyal analysis
          </span>
        </div>
        <div className='block'>
          <Group>
            <Button
              block
              onClick={() => push(`/projects/create`)}
              style='success'
            >
              <Icon type='cubes' /> {messages.region.createAction}
            </Button>
          </Group>
          {projects.length > 0 &&
            <div>
              <p style={{textAlign: 'center'}}>
                {messages.region.goToExisting}
              </p>
              <div className='list-group'>
                {projects.map(project => (
                  <Link
                    className='list-group-item'
                    key={project._id}
                    to={`/projects/${project._id}`}
                    title={messages.region.goToRegion}
                  >
                    {project.statusCode === 'DONE'
                      ? <span><Icon type='cubes' /> {project.name}</span>
                      : <div>
                        <p>
                          <Icon type='spinner' className='fa-spin' />
                          {' '}
                          {project.name}
                        </p>
                        <em>
                          {messages.region.statusCode[project.statusCode]}
                        </em>
                      </div>}
                  </Link>
                ))}
              </div>
            </div>}
        </div>
      </InnerDock>
    )
  }
}
