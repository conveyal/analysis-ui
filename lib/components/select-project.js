// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import InnerDock from './inner-dock'
import {Group} from './input'
import messages from '../utils/messages'

type Props = {
  regionId: string,
  projects: Array<{_id: string, name: string}>
}

export default class SelectProject extends Component<void, Props, void> {
  render () {
    const {regionId, projects} = this.props
    const btn = `btn btn-block btn`
    return (
      <InnerDock>
        <div className='block'>
          <Group>
            <Link
              className={`${btn}-success`}
              to={`/regions/${regionId}/projects/create`}
              title={messages.project.createAction}
            >
              <Icon type='cube' /> {messages.project.createAction}
            </Link>
            <Link
              className={`${btn}-success`}
              to={`/regions/${regionId}/bundles/create`}
              title={messages.project.uploadBundle}
            >
              <Icon type='database' /> {messages.project.uploadBundle}
            </Link>
            <Link
              className={`${btn}-success`}
              to={`/regions/${regionId}/opportunities`}
              title={messages.project.uploadOpportunityDataset}
            >
              <Icon type='th' /> {messages.project.uploadOpportunityDataset}
            </Link>
            <Link
              className={`${btn}-warning`}
              to={`/regions/${regionId}/edit`}
              title={messages.region.configure}
            >
              <Icon type='gear' /> {messages.region.configure}
            </Link>
          </Group>

          {projects.length > 0 &&
            <div>
              <p className='center'>
                {messages.project.goToExisting}
              </p>
              <div className='list-group'>
                {projects.map(project => (
                  <Link
                    className='list-group-item'
                    key={project._id}
                    to={`/projects/${project._id}`}
                    title={messages.project.goToProject}
                  >
                    <Icon type='cube' /> {project.name}
                  </Link>
                ))}
              </div>
            </div>}
        </div>
      </InnerDock>
    )
  }
}
