// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Group} from './input'
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
            title='Create a new Scenario'
            ><Icon type='cube' /> Create a new Scenario
          </Link>
          <Link
            className={`${btn}-success`}
            to={`/projects/${projectId}/bundles/create`}
            title='Upload new GTFS Bundle'
            ><Icon type='database' /> Upload new GTFS Bundle
          </Link>
          <Link
            className={`${btn}-success`}
            to={`/projects/${projectId}/grids/create`}
            title='Upload new Opportunity Data'
            ><Icon type='th' /> Upload new Opportunity Data
          </Link>
          <Link
            className={`${btn}-warning`}
            to={`/projects/${projectId}/edit`}
            title='Configure Project'
            ><Icon type='gear' /> Configure Project Settings
          </Link>
        </Group>

        {scenarios.length > 0 &&
          <div>
            <p className='center'>or go to an existing scenario</p>
            {scenarios.map((scenario) =>
              <Link
                className='BlockLink'
                key={scenario.id}
                to={`/scenarios/${scenario.id}`}
                title='Edit Scenario'
                ><Icon type='cube' /> {scenario.name}
              </Link>)}
          </div>}
      </Body>
    )
  }
}
