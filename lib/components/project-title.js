// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import {Title} from './base'
import Link, {IconLink} from './link'
import Modal, {ModalBody, ModalTitle} from './modal'
import messages from '../utils/messages'

type Props = {
  _id: string,
  downloadScenario: (index: number) => void,
  project?: {
    bundleId: string,
    _id: string,
    name: string,
    regionId: string,
    variants: string[]
  },
  deleteProject: (project: any) => void
}

type State = {
  showPrintSelect: boolean,
  showExportSelect: boolean
}

export default class ProjectTitle extends Component {
  props: Props
  state: State

  state = {
    showPrintSelect: false,
    showExportSelect: false
  }

  _deleteProject = () => {
    if (window.confirm(messages.project.deleteConfirmation)) {
      this.props.deleteProject(this.props.project)
    }
  }

  _showExportSelect = () => this.setState({showExportSelect: true})
  _showPrintSelect = () => this.setState({showPrintSelect: true})

  _export = (index: number) => {
    this.props.downloadScenario(index)
  }

  render () {
    const {_id, project} = this.props
    const name = project ? project.name : 'Loading...'
    return (
      <Title>
        <Icon type='cube' /> {name}
        {project &&
          <span>
            <IconLink
              className='pull-right'
              onClick={this._deleteProject}
              title={messages.project.delete}
              type='trash' />
            <IconLink
              className='pull-right'
              title={messages.project.editName}
              to={`/regions/${project.regionId}/projects/${_id}/edit`}
              type='gear' />
            <IconLink
              className='pull-right'
              to={`/regions/${project.regionId}/projects/${_id}/import-shapefile`}
              title={messages.project.importShapefile}
              type='globe' />
            <Link
              className='pull-right'
              onClick={this._showPrintSelect}
              title='Print project'
              >
              <Icon type='print' />
              {this.state.showPrintSelect &&
                <SelectScenario
                  label='print'
                  onHide={() => this.setState({showPrintSelect: false})}
                  regionId={project.regionId}
                  projectId={_id}
                  scenarios={project.variants}
                />}
            </Link>
            <Link
              className='pull-right'
              onClick={this._showExportSelect}
              title='Export project'
              >
              <Icon type='upload' />
              {this.state.showExportSelect &&
                <SelectScenario
                  action={this._export}
                  label='export'
                  onHide={() => this.setState({showExportSelect: false})}
                  scenarios={project.variants}
                />}
            </Link>
          </span>}
      </Title>
    )
  }
}

function SelectScenario ({action, regionId, label, onHide, projectId, scenarios}) {
  return (
    <Modal onRequestClose={onHide}>
      <ModalTitle>
        {messages.variant.export} {label}:
      </ModalTitle>
      <ModalBody>
        <ul>
          {scenarios.map((name, index) => (
            <li key={`scenario-${index}`}>
              <a
                onClick={label === 'export' ? () => action(index) : () => {}}
                href={label === 'print' ? `/reports/${regionId}/projects/${projectId}/variants/${index}` : ''}
                tabIndex={0}
                target={label === 'print' ? '_blank' : ''}>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </ModalBody>
    </Modal>
  )
}
