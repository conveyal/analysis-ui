// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Button} from './buttons'
import {Group} from './input'
import {Body} from './panel'

type Props = {
  projectId: string,
  push(string): void,
  scenarios: Array<{id: string, name: string}>
}

export default class SelectScenario extends Component<void, Props, void> {
  _createBundle = () =>
    this.props.push(`/projects/${this.props.projectId}/bundles/create`)

  _createIndicator = () =>
    this.props.push(`/projects/${this.props.projectId}/grids/create`)

  _createScenario = () =>
    this.props.push(`/projects/${this.props.projectId}/scenarios/create`)

  _selectScenario = (option: {value: string}) =>
    this.props.push(`/scenarios/${option.value}`)

  render () {
    const {scenarios} = this.props
    return (
      <Body>
        <Group>
          <Button
            block
            onClick={this._createScenario}
            style='success'
            ><Icon type='cube' /> Create a new Scenario
          </Button>
          <Button
            block
            onClick={this._createBundle}
            style='success'
            ><Icon type='database' /> Upload new GTFS Bundle
          </Button>
          <Button
            block
            onClick={this._createIndicator}
            style='success'
            ><Icon type='th' /> Upload new Opportunity Data
          </Button>
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
