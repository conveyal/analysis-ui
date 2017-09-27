// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import Modal, {ModalBody, ModalTitle} from './modal'
import {Body as PanelBody} from './panel'
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
    if (window.confirm(messages.scenario.deleteConfirmation)) {
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
          <a
            className='pull-right'
            onClick={this._deleteScenario}
            tabIndex={0}
            title={messages.scenario.delete}
            type='button'
            >
            <Icon type='trash' />
          </a>
          <Link
            className='pull-right'
            title={messages.scenario.editName}
            to={`/scenarios/${id}/edit`}
            >
            <Icon type='gear' />
          </Link>
          <Link
            className='pull-right'
            to={`/scenarios/${id}/import-shapefile`}
            title={messages.scenario.importShapefile}
            >
            <Icon type='globe' />
          </Link>
          <a
            className='pull-right'
            onClick={this._showPrintSelect}
            tabIndex={0}
            title='Print scenario'
            type='button'
            >
            <Icon type='print' />
            {this.state.showPrintSelect &&
            <SelectVariant
              action={this._print}
              label='print'
              onHide={() => this.setState({showPrintSelect: false})}
              variants={scenario.variants}
                />}
          </a>
          <a
            className='pull-right'
            onClick={this._showExportSelect}
            tabIndex={0}
            title='Export scenario'
            type='button'
            >
            <Icon type='upload' />
            {this.state.showExportSelect &&
            <SelectVariant
              action={this._export}
              label='export'
              onHide={() => this.setState({showExportSelect: false})}
              variants={scenario.variants}
                />}
          </a>
        </div>
        {bundle && modifications
            ? children
            : <div className='InnerDock'>
              <PanelBody>
                {messages.scenario.loadingGTFS}
              </PanelBody>
            </div>}
      </div>
      : <PanelBody>
        {messages.scenario.loading}
      </PanelBody>
  }
}

function SelectVariant ({action, label, onHide, variants}) {
  return (
    <Modal onRequestClose={onHide}>
      <ModalTitle>
        Select variant to {label}:
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
