// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import InnerDock from './inner-dock'
import {Group} from './input'
import messages from '../utils/messages'

type Props = {
  regionId: string,
  scenarios: Array<{_id: string, name: string}>
}

export default class SelectScenario extends Component<void, Props, void> {
  render () {
    const {regionId, scenarios} = this.props
    const btn = `btn btn-block btn`
    return (
      <InnerDock>
        <div className='block'>
          <Group>
            <Link
              className={`${btn}-success`}
              to={`/regions/${regionId}/scenarios/create`}
              title={messages.scenario.createAction}
            >
              <Icon type='cube' /> {messages.scenario.createAction}
            </Link>
            <Link
              className={`${btn}-success`}
              to={`/regions/${regionId}/bundles/create`}
              title={messages.scenario.uploadBundle}
            >
              <Icon type='database' /> {messages.scenario.uploadBundle}
            </Link>
            <Link
              className={`${btn}-success`}
              to={`/regions/${regionId}/opportunities`}
              title={messages.scenario.uploadOpportunityDataset}
            >
              <Icon type='th' /> {messages.scenario.uploadOpportunityDataset}
            </Link>
            <Link
              className={`${btn}-warning`}
              to={`/regions/${regionId}/edit`}
              title={messages.region.configure}
            >
              <Icon type='gear' /> {messages.region.configure}
            </Link>
          </Group>

          {scenarios.length > 0 &&
            <div>
              <p className='center'>
                {messages.scenario.goToExisting}
              </p>
              <div className='list-group'>
                {scenarios.map(scenario => (
                  <Link
                    className='list-group-item'
                    key={scenario._id}
                    to={`/scenarios/${scenario._id}`}
                    title={messages.scenario.goToScenario}
                  >
                    <Icon type='cube' /> {scenario.name}
                  </Link>
                ))}
              </div>
            </div>}
        </div>
      </InnerDock>
    )
  }
}
