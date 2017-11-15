// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import InnerDock from './inner-dock'
import Link, {IconLink} from './link'
import Modal, {ModalBody, ModalTitle} from './modal'
import messages from '../utils/messages'

type Props = {
  _id: string,
  bundle?: {
    _id: string
  },
  children: any,
  downloadVariant: (index: number) => void,
  load: string => void,
  modifications?: any[],
  project?: {
    bundleId: string,
    _id: string,
    name: string,
    regionId: string,
    variants: string[]
  },
  deleteProject: () => void,
  setCurrentProject: any => void
}

type State = {
  showPrintSelect: boolean,
  showExportSelect: boolean
}

export default class Project extends Component {
  props: Props
  state: State

  state = {
    showPrintSelect: false,
    showExportSelect: false
  }

  componentDidMount () {
    const {_id, load} = this.props
    load(_id)
  }

  componentWillUnmount () {
    this.props.setCurrentProject()
  }

  _deleteProject = () => {
    if (window.confirm(messages.project.deleteConfirmation)) {
      this.props.deleteProject()
    }
  }

  _showExportSelect = () => this.setState({showExportSelect: true})
  _showPrintSelect = () => this.setState({showPrintSelect: true})

  _export = (index: number) => {
    this.props.downloadVariant(index)
  }

  render () {
    const {bundle, children, _id, modifications, project} = this.props
    return project
      ? <div>
        <div className='ApplicationDockTitle'>
          <Icon type='cube' /> {project.name}
          <IconLink
            className='pull-right'
            onClick={this._deleteProject}
            title={messages.project.delete}
            type='trash' />
          <IconLink
            className='pull-right'
            title={messages.project.editName}
            to={`/projects/${_id}/edit`}
            type='gear' />
          <IconLink
            className='pull-right'
            to={`/projects/${_id}/import-shapefile`}
            title={messages.project.importShapefile}
            type='globe' />
          <Link
            className='pull-right'
            onClick={this._showPrintSelect}
            title='Print project'
            >
            <Icon type='print' />
            {this.state.showPrintSelect &&
            <SelectVariant
              label='print'
              onHide={() => this.setState({showPrintSelect: false})}
              regionId={project.regionId}
              projectId={_id}
              variants={project.variants}
                />}
          </Link>
          <Link
            className='pull-right'
            onClick={this._showExportSelect}
            title='Export project'
            >
            <Icon type='upload' />
            {this.state.showExportSelect &&
            <SelectVariant
              action={this._export}
              label='export'
              onHide={() => this.setState({showExportSelect: false})}
              variants={project.variants}
                />}
          </Link>
        </div>
        {bundle && modifications
            ? children
            : <InnerDock><div className='block'>{messages.project.loadingGTFS}</div></InnerDock>}
      </div>
      : <InnerDock><div className='block'>
        {messages.project.loading}
      </div></InnerDock>
  }
}

function SelectVariant ({label, regionId, onHide, projectId, variants}) {
  return (
    <Modal onRequestClose={onHide}>
      <ModalTitle>
        {messages.variant.export} {label}:
      </ModalTitle>
      <ModalBody>
        <ul>
          {variants.map((name, index) => (
            <li key={`variant-${index}`}>
              <a
                href={`/reports/${regionId}/projects/${projectId}/variants/${index}`}
                tabIndex={0}
                target='_blank'>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </ModalBody>
    </Modal>
  )
}
