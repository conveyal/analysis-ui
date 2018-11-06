// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React, {Component} from 'react'

import {Title} from './base'
import Link, {IconLink} from './link'
import Modal, {ModalBody, ModalTitle} from './modal'

import {Button, Group as ButtonGroup} from './buttons'
import Collapsible from './collapsible'

type Props = {
  _id: string,
  downloadScenario: (index: number) => void,
  project?: {
    _id: string,
    bundleId: string,
    name: string,
    regionId: string,
    variants: string[]
  }
}

type State = {
  showExportSelect: boolean,
  showPrintSelect: boolean
}

export default class ProjectTitle extends Component {
  props: Props
  state: State

  state = {
    showPrintSelect: false,
    showExportSelect: false
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
              title={message('project.editSettings')}
              to={`/regions/${project.regionId}/projects/${_id}/edit`}
              type='gear' />
            <IconLink
              className='pull-right'
              onClick={this._showExportSelect}
              title={message('project.export')}
              type='share-alt-square' />
              {this.state.showExportSelect &&
                <SelectScenario
                  action={this._export}
                  label='export'
                  onHide={() => this.setState({showExportSelect: false})}
                  regionId={project.regionId}
                  projectId={_id}
                  scenarios={project.variants}
                />}
          </span>}
      </Title>
    )
  }
}

function SelectScenario ({action, regionId, label, onHide, projectId, scenarios}) {
  return (
    <Modal onRequestClose={onHide}>
      <ModalTitle>
        {message('variant.export')}
      </ModalTitle>
      <ModalBody>
        {scenarios.map((name, index) => (
          <Collapsible title={name}>
            <ButtonGroup justified>
              <Button
                style='info'
                onClick={() => action(index)}
              >
                <Icon type='download' />
                Scenario (.json)
              </Button>
              <Button
                style='info'
                href={`/reports/${regionId}/projects/${projectId}/variants/${index}`}
                target='_blank'
              >
                <Icon type='print' />
                Summary report
              </Button>
            </ButtonGroup>
          </Collapsible>
        ))}
      </ModalBody>
    </Modal>
  )
}
