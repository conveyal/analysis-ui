// @flow
import React, {PureComponent} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import messages from '../utils/messages'

type Props = {
  candidateScenarioOptions: Array<{
    label: string,
    value: string
  }>,
  copyFromScenario: ({
    fromScenarioId: string,
    toScenarioId: string
  }) => void,
  toScenarioId: string
}

type State = {
  importScenarioId?: string
}

export default class ImportModifications
  extends PureComponent<void, Props, State> {
  state = {}

  _copyModificationsFromScenario = () => {
    const {copyFromScenario, toScenarioId} = this.props
    const {importScenarioId} = this.state
    if (importScenarioId) {
      copyFromScenario({
        fromScenarioId: importScenarioId,
        toScenarioId
      })
    }
  }

  _setImportScenarioId = (scenario: {value: string}) => {
    this.setState({importScenarioId: scenario.value})
  }

  render () {
    const {candidateScenarioOptions} = this.props
    const {importScenarioId} = this.state
    return (
      <InnerDock>
        <div className='block'>
          <h5>{messages.project.importModifications}</h5>
          <div className='form-group'>
            <Select
              clearable={false}
              onChange={this._setImportScenarioId}
              options={candidateScenarioOptions}
              placeholder={messages.project.select}
              value={importScenarioId}
            />
          </div>
          <Button
            block
            disabled={!importScenarioId}
            onClick={this._copyModificationsFromScenario}
            style='success'
          >
            {messages.project.importAction}
          </Button>
        </div>
      </InnerDock>
    )
  }
}
