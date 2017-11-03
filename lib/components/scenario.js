// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import Link, {IconLink} from './link'
import Modal, {ModalBody, ModalTitle} from './modal'
import messages from '../utils/messages'

type Props = {
  bundle?: {
    id: string
  },
  children: any,
  downloadVariant: (index: number) => void,
  printVariant: (index: number) => void,
  id: string,
  load: string => void,
  modifications?: any[],
  scenario?: {
    bundleId: string,
    id: string,
    name: string,
    projectId: string,
    variants: string[]
  },
  deleteScenario: () => void,
  setCurrentScenario: any => void
}

type State = {
  showPrintSelect: boolean,
  showExportSelect: boolean
}

export default class Scenario extends Component {
  props: Props
  state: State

  state = {
    showPrintSelect: false,
    showExportSelect: false
  }

  componentDidMount () {
    const {id, load} = this.props
    load(id)
  }

  componentWillUnmount () {
    this.props.setCurrentScenario()
  }

  _deleteScenario = () => {
    if (window.confirm(messages.project.deleteConfirmation)) {
      this.props.deleteScenario()
    }
  }

  _showExportSelect = () => this.setState({showExportSelect: true})
  _showPrintSelect = () => this.setState({showPrintSelect: true})

  _export = (index: number) => {
    this.props.downloadVariant(index)
  }

  _print = (index: number) => {
    this.props.printVariant(index)
  }

  render () {
    const {bundle, children, id, modifications, scenario} = this.props
    return scenario
      ? <div>
        <div className='ApplicationDockTitle'>
          <Icon type='cube' /> {scenario.name}
          <IconLink
            className='pull-right'
            onClick={this._deleteScenario}
            title={messages.project.delete}
            type='trash' />
          <IconLink
            className='pull-right'
            title={messages.project.editName}
            to={`/scenarios/${id}/edit`}
            type='gear' />
          <IconLink
            className='pull-right'
            to={`/scenarios/${id}/import-shapefile`}
            title={messages.project.importShapefile}
            type='globe' />
          <Link
            className='pull-right'
            onClick={this._showPrintSelect}
            title='Print scenario'
            >
            <Icon type='print' />
            {this.state.showPrintSelect &&
            <SelectVariant
              action={this._print}
              label='print'
              onHide={() => this.setState({showPrintSelect: false})}
              variants={scenario.variants}
                />}
          </Link>
          <Link
            className='pull-right'
            onClick={this._showExportSelect}
            title='Export scenario'
            >
            <Icon type='upload' />
            {this.state.showExportSelect &&
            <SelectVariant
              action={this._export}
              label='export'
              onHide={() => this.setState({showExportSelect: false})}
              variants={scenario.variants}
                />}
          </Link>
        </div>
        {bundle && modifications
            ? children
            : <div className='block'>{messages.project.loadingGTFS}</div>}
      </div>
      : <div className='block'>
        {messages.project.loading}
      </div>
  }
}

function SelectVariant ({action, label, onHide, variants}) {
  return (
    <Modal onRequestClose={onHide}>
      <ModalTitle>
        {messages.scenario.export} {label}:
      </ModalTitle>
      <ModalBody>
        <ul>
          {variants.map((name, index) => (
            <li key={`variant-${index}`}>
              <a onClick={() => action(index)} tabIndex={0} type='button'>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </ModalBody>
    </Modal>
  )
}
