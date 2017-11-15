// @flow
import React, {PureComponent} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import messages from '../utils/messages'

type Props = {
  candidateProjectOptions: Array<{
    label: string,
    value: string
  }>,
  copyFromProject: ({
    fromProjectId: string,
    toProjectId: string
  }) => void,
  toProjectId: string
}

type State = {
  importProjectId?: string
}

export default class ImportModifications
  extends PureComponent<void, Props, State> {
  state = {}

  _copyModificationsFromProject = () => {
    const {copyFromProject, toProjectId} = this.props
    const {importProjectId} = this.state
    if (importProjectId) {
      copyFromProject({
        fromProjectId: importProjectId,
        toProjectId
      })
    }
  }

  _setImportProjectId = (project: {value: string}) => {
    this.setState({importProjectId: project.value})
  }

  render () {
    const {candidateProjectOptions} = this.props
    const {importProjectId} = this.state
    return (
      <InnerDock>
        <div className='block'>
          <h5>{messages.project.importModifications}</h5>
          <div className='form-group'>
            <Select
              clearable={false}
              onChange={this._setImportProjectId}
              options={candidateProjectOptions}
              placeholder={messages.project.select}
              value={importProjectId}
            />
          </div>
          <Button
            block
            disabled={!importProjectId}
            onClick={this._copyModificationsFromProject}
            style='success'
          >
            {messages.project.importAction}
          </Button>
        </div>
      </InnerDock>
    )
  }
}
