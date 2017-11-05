// @flow
import Icon from '@conveyal/woonerf/components/icon'
import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import {Group as FormGroup, Text} from './input'
import messages from '../utils/messages'

type Props = {
  bundleId: string,
  name: string
}

export default class EditScenario extends PureComponent {
  static propTypes = {
    _id: PropTypes.string,
    bundleId: PropTypes.string,
    bundleName: PropTypes.string,
    bundles: PropTypes.array.isRequired,
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
    const {close, create, _id, isEditing, projectId, variants, save} = this.props
    const {bundleId, name} = this.state
    if (name && bundleId) {
      if (isEditing) {
        save({bundleId, _id, name, projectId, variants})
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
      <InnerDock>
        <div className='block'>
          <h5>
            {isEditing && messages.project.editTitle}
            {!isEditing && messages.project.createAction}
          </h5>
          <Text
            name={messages.project.name}
            onChange={e => this.setState({...this.state, name: e.target.value})}
            value={name}
          />
          {isEditing &&
            <FormGroup>
              <strong>Bundle:</strong> {bundleName} <br />
              <small>Bundle cannot be changed once a scenario is created</small>
            </FormGroup>}
          {!isEditing &&
            <p>{messages.project.createActionTooltip}</p>}
          {!isEditing &&
            bundles.length > 0 &&
            <FormGroup id='select-bundle'>
              <Select
                clearable={false}
                id='select-bundle'
                options={bundles.map(bundle => {
                  return {value: bundle._id, label: bundle.name}
                })}
                onChange={option =>
                  this.setState({...this.state, bundleId: option.value})}
                placeholder='Select a GTFS bundle...'
                value={bundleId}
              />
            </FormGroup>}
          {!isEditing &&
            bundles.length === 0 &&
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
              ? messages.project.editAction
              : messages.project.createAction}
          </Button>
        </div>
      </InnerDock>
    )
  }
}
