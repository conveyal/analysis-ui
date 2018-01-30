// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {ButtonLink} from './buttons'
import InnerDock from './inner-dock'
import {Group} from './input'
import messages from '../utils/messages'

import type {Region} from '../types'

type Props = {
  region: Region,
  projects: Array<{_id: string, name: string}>
}

function Status ({code}) {
  switch (code) {
    case 'DONE':
      return <span />
    case 'ERROR':
      return <div className='alert alert-danger'>{messages.region.statusCode.ERROR}</div>
    default:
      return <div className='alert alert-info'><Icon type='spinner' className='fa-spin' /> {messages.region.statusCode[code]}</div>
  }
}

export default class SelectProject extends Component {
  props: Props

  render () {
    const {region, projects} = this.props
    return (
      <InnerDock>
        <div className='block'>
          <Status code={region.statusCode} />

          <Group>
            <ButtonLink
              block
              style='success'
              to={`/regions/${region._id}/projects/create`}
              title={messages.project.createAction}
            >
              <Icon type='plus' /> {messages.project.createAction}
            </ButtonLink>
            <ButtonLink
              block
              style='success'
              to={`/regions/${region._id}/bundles/create`}
              title={messages.project.uploadBundle}
            >
              <Icon type='database' /> {messages.project.uploadBundle}
            </ButtonLink>
            <ButtonLink
              block
              style='success'
              to={`/regions/${region._id}/opportunities`}
              title={messages.project.uploadOpportunityDataset}
            >
              <Icon type='th' /> {messages.project.uploadOpportunityDataset}
            </ButtonLink>
            <ButtonLink
              block
              style='warning'
              to={`/regions/${region._id}/edit`}
              title={messages.region.configure}
            >
              <Icon type='gear' /> {messages.region.configure}
            </ButtonLink>
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
