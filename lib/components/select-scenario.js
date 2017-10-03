// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Group} from './input'
import messages from '../utils/messages'
import {Body} from './panel'

type Props = {
  projectId: string,
  scenarios: Array<{id: string, name: string}>
}

export default class SelectScenario extends Component<void, Props, void> {
  render () {
    const {projectId, scenarios} = this.props
    const btn = `btn btn-block btn`
    return (
      <Body>
        <Group>
          <Link
            className={`${btn}-success`}
            to={`/projects/${projectId}/scenarios/create`}
            title={messages.project.createAction}
          >
            <Icon type='cube' /> {messages.project.createAction}
          </Link>
          <Link
            className={`${btn}-success`}
            to={`/projects/${projectId}/bundles/create`}
            title={messages.project.uploadBundle}
          >
            <Icon type='database' /> {messages.project.uploadBundle}
          </Link>
          <Link
            className={`${btn}-success`}
            to={`/projects/${projectId}/grids/create`}
            title={messages.project.uploadOpportunityDataset}
          >
            <Icon type='th' /> {messages.project.uploadOpportunityDataset}
          </Link>
          <Link
            className={`${btn}-warning`}
            to={`/projects/${projectId}/edit`}
            title={messages.region.configure}
          >
            <Icon type='gear' /> {messages.region.configure}
          </Link>
        </Group>

        {scenarios.length > 0 &&
          <div>
            <p className='center'>
              {messages.project.goToExisting}
            </p>
            <div className='list-group'>
              {scenarios.map(scenario => (
                <Link
                  className='list-group-item'
                  key={scenario.id}
                  to={`/scenarios/${scenario.id}`}
                  title={messages.project.goToScenario}
                >
                  <Icon type='cube' /> {scenario.name}
                </Link>
              ))}
            </div>
          </div>}
      </Body>
    )
  }
}
