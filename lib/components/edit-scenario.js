// @flow
import Icon from '@conveyal/woonerf/components/icon'
import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'

import {Button} from './buttons'
import {Group as FormGroup, Text} from './input'
import {Body, Heading, Panel} from './panel'
import messages from '../utils/messages'

type Props = {
  bundleId: string,
  name: string
}

export default class EditScenario extends PureComponent {
  static propTypes = {
    bundleId: PropTypes.string,
    bundleName: PropTypes.string,
    bundles: PropTypes.array.isRequired,
    id: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    name: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    variants: PropTypes.array,

    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
  }

  state = {
    bundleId: this.props.bundleId,
    name: this.props.name
  }

  componentWillReceiveProps (newProps: Props) {
    this.setState({bundleId: newProps.bundleId, name: newProps.name})
  }

  _createOrSave = () => {
    const {close, create, id, isEditing, projectId, variants, save} = this.props
    const {bundleId, name} = this.state
    if (name && bundleId) {
      if (isEditing) {
        save({bundleId, id, name, projectId, variants})
        close()
      } else {
        create({
          bundleId,
          name,
          projectId,
          variants
        })
      }
    }
  }

  _goToCreateBundle = () => this.props.goToCreateBundle(this.props.projectId)

  render () {
    const {bundleName, bundles, isEditing} = this.props
    const {bundleId, name} = this.state
    const readyToCreate =
      name && name.length > 0 && bundleId && bundleId.length > 0
    return (
      <Panel>
        <Heading>
          {isEditing &&
            messages.scenario.editTitle}
          {!isEditing &&
            messages.scenario.createAction}
          {!isEditing &&
            <a data-tip={messages.scenario.createActionTooltip}>
              <Icon type='question-circle-o' className='fa-lg pull-right' />
              <ReactTooltip className='help-tooltip' place='right' />
            </a>}
        </Heading>
        <Body>
          <Text
            name='Scenario name'
            onChange={e => this.setState({...this.state, name: e.target.value})}
            value={name}
          />
          {isEditing &&
            <FormGroup>
              <strong>Bundle:</strong> {bundleName} <br />
              <small>Bundle cannot be changed once a scenario is created</small>
            </FormGroup>}
          {!isEditing && bundles.length > 0 &&
            <FormGroup id='select-bundle'>
              <Select
                clearable={false}
                id='select-bundle'
                options={bundles.map(bundle => {
                  return {value: bundle.id, label: bundle.name}
                })}
                onChange={option =>
                  this.setState({...this.state, bundleId: option.value})}
                placeholder='Select a GTFS bundle...'
                value={bundleId}
              />
            </FormGroup>}
          {!isEditing && bundles.length === 0 &&
            <Button block onClick={this._goToCreateBundle} style='success'>
              <Icon type='plus' /> {messages.bundle.create}
            </Button>}
          <Button
            block
            disabled={!readyToCreate}
            onClick={this._createOrSave}
            style='success'
          >
            {isEditing
              ? messages.scenario.editAction
              : messages.scenario.createAction}
          </Button>
        </Body>
      </Panel>
    )
  }
}
