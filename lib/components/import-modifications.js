// @flow
import React, {PureComponent} from 'react'
import Select from 'react-select'

import {Application, Dock} from './base'
import {Button} from './buttons'
import ProjectTitle from '../containers/project-title'
import message from '@conveyal/woonerf/message'
import Icon from '@conveyal/woonerf/components/icon'


type Props = {
  candidateProjectOptions: Array<{
    label: string,
    value: string
  }>,
  copyFromProject: ({
    fromProjectId: string,
    toProjectId: string
  }) => void,
  toProjectId: string,
  regionId: string,
  push: string => void
}

type State = {
  importProjectId?: string
}

export default class ImportModifications
  extends PureComponent<void, Props, State> {
  state = {}

  _goToImportShapefile = () => {
    const {push, toProjectId, regionId} = this.props
    push(`/regions/${regionId}/projects/${toProjectId}/import-shapefile`)
  }

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
    const {candidateProjectOptions, regionId, toProjectId} = this.props
    const {importProjectId} = this.state
    return (
      <Application>
        <ProjectTitle />
        <Dock>
        <h5>{message('modification.importFromShapefile')}</h5>
        <Button
          block
          onClick={this._goToImportShapefile}
          style='success'
        >
          <Icon type='upload'/> {message('project.importAction')}
        </Button>
        <br/>
          <h5>{message('modification.importFromProject')}</h5>
          <div className='form-group'>
            <Select
              clearable={false}
              onChange={this._setImportProjectId}
              options={candidateProjectOptions}
              placeholder={message('project.select')}
              value={importProjectId}
            />
          </div>
          <Button
            block
            disabled={!importProjectId}
            onClick={this._copyModificationsFromProject}
            style='success'
          >
            <Icon type='copy'/> {message('project.importAction')}
          </Button>
        </Dock>
      </Application>
    )
  }
}
