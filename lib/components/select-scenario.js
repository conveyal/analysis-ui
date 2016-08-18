import React, {Component, PropTypes} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import {Group} from './input'
import {Body} from './panel'

export default class SelectScenario extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    scenarios: PropTypes.array.isRequired
  }

  render () {
    const {projectId, push, scenarios} = this.props
    return (
      <Body>
        <Group>
          <Select
            options={scenarios.map((scenario) => { return {value: scenario.id, label: scenario.name} })}
            onChange={(option) => push(`/projects/${projectId}/scenarios/${option.value}`)}
            placeholder='Select a scenario...'
            />
        </Group>
        <Button
          block
          onClick={() => push(`/projects/${projectId}/scenarios/create`)}
          style='success'
          >Create a new scenario
        </Button>
      </Body>
    )
  }
}
