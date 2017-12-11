// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {PureComponent} from 'react'
import Select from 'react-select'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import {Group as FormGroup, Text} from './input'
import messages from '../utils/messages'

import type {Bundle, Project} from '../types'

type Props = {
  bundles: Bundle[],
  bundleId: string,
  bundleName: string,
  isEditing: boolean,
  name: string,
  project: Project,
  regionId: string,
  variants: string[],

  close: (any) => void,
  create: (any) => void,
  goToCreateBundle: () => void,
  save: (any) => void
}

export default class EditProject extends PureComponent {
  props: Props

  state = {
    bundleId: this.props.bundleId,
    name: this.props.name
  }

  componentWillReceiveProps (newProps: Props) {
    this.setState({bundleId: newProps.bundleId, name: newProps.name})
  }

  _createOrSave = () => {
    const {close, create, isEditing, project, regionId, variants, save} = this.props
    const {bundleId, name} = this.state
    if (name && bundleId) {
      if (isEditing) {
        save({...project, name})
        close()
      } else {
        create({
          bundleId,
          name,
          regionId,
          variants
        })
      }
    }
  }

  _goToCreateBundle = () => this.props.goToCreateBundle(this.props.regionId)

  render () {
    const {bundleName, bundles, isEditing} = this.props
    const {bundleId, name} = this.state
    const readyToCreate =
      name && name.length > 0 && bundleId && bundleId.length > 0
    return (
      <InnerDock>
        <div className='block'>
          <h5>
            {isEditing ? messages.project.editTitle : messages.project.createAction}
          </h5>
          <Text
            name={messages.project.name}
            onChange={e => this.setState({...this.state, name: e.target.value})}
            value={name}
          />
          {isEditing &&
            <FormGroup>
              <strong>Bundle:</strong> {bundleName} <br />
              <small>Bundle cannot be changed once a project is created</small>
            </FormGroup>}
          {!isEditing &&
            <div>
              <p>{messages.project.createActionTooltip}</p>
              {bundles.length > 0
                ? <FormGroup id='select-bundle'>
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
                </FormGroup>
              : <p>{messages.project.noBundles}</p>}
              <FormGroup>
                <Button block onClick={this._goToCreateBundle} style='success'>
                  <Icon type='plus' /> {messages.bundle.create}
                </Button>
              </FormGroup>
            </div>}
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
