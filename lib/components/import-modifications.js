// @flow
import React, {PureComponent} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import {Body, Heading, Panel} from './panel'

type Props = {
  candidateScenarioOptions: Array<{
    label: string,
    value: string
  }>,
  copyFromScenario: ({
    fromScenarioId: string,
    toScenarioId: string,
    variants: number[]
  }) => void,
  toScenarioId: string,
  variants: number[]
}

type State = {
  importScenarioId?: string
}

export default class ImportModifications extends PureComponent<void, Props, State> {
  state = {}

  _copyModificationsFromScenario = () => {
    const {copyFromScenario, toScenarioId, variants} = this.props
    const {importScenarioId} = this.state
    if (importScenarioId) {
      copyFromScenario({
        fromScenarioId: importScenarioId,
        toScenarioId,
        variants
      })
    }
  }

  _setImportScenarioId = (scenarioId: void | {value: string}) => {
    this.setState({importScenarioId: scenarioId && scenarioId.value})
  }

  render () {
    const {candidateScenarioOptions} = this.props
    const {importScenarioId} = this.state
    return (
      <Panel>
        <Heading>Import modifications from another scenario</Heading>
        <Body>
          <div className='form-group'>
            <Select
              onChange={this._setImportScenarioId}
              options={candidateScenarioOptions}
              placeholder='Select a scenario...'
              value={importScenarioId}
              />
          </div>
          <Button
            block
            disabled={!importScenarioId}
            onClick={this._copyModificationsFromScenario}
            style='success'
            >Import modifications
          </Button>
        </Body>
      </Panel>
    )
  }
}
