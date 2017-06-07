// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import {Group} from './input'
import {Body} from './panel'

type Props = {
  projectId: string,
  push(string): void,
  scenarios: Array<{id: string, name: string}>
}

export default class SelectScenario extends Component<void, Props, void> {
  _createScenario = () =>
    this.props.push(`/projects/${this.props.projectId}/scenarios/create`)

  _selectScenario = (option: {value: string}) =>
    this.props.push(`/scenarios/${option.value}`)

  render () {
    const {scenarios} = this.props
    return (
      <Body>
        {scenarios.length > 0 &&
          <div>
            <Group>
              <Select
                options={scenarios.map((scenario) => { return {value: scenario.id, label: scenario.name} })}
                onChange={this._selectScenario}
                placeholder='Select an existing scenario...'
                />
            </Group>
            <p className='center'>or</p>
          </div>}
        <Button
          block
          onClick={this._createScenario}
          style='success'
          ><Icon type='plus' /> Create a new scenario
        </Button>
      </Body>
    )
  }
}
