// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React from 'react'
import Select from 'react-select'

import {Application, Title, Dock} from './base'
import {Button} from './buttons'
import {Group as FormGroup, Text} from './input'
import messages from '../utils/messages'

import type {Bundle} from '../types'

type Props = {
  bundles: Bundle[],
  regionId: string,

  create: (any) => void,
  goToCreateBundle: () => void
}

export default class CreateProject extends React.PureComponent {
  props: Props

  state = {
    bundleId: null,
    name: ''
  }

  _create = () => {
    const {create, regionId} = this.props
    const {bundleId, name} = this.state
    if (name && bundleId) {
      create({
        bundleId,
        name,
        regionId
      })
    }
  }

  _goToCreateBundle = () => this.props.goToCreateBundle(this.props.regionId)

  render () {
    const {bundles} = this.props
    const {bundleId, name} = this.state
    const readyToCreate =
      name && name.length > 0 && bundleId && bundleId.length > 0
    return (
      <Application>
        <Title>{messages.project.createAction}</Title>
        <Dock>
          <Text
            name={messages.project.name}
            onChange={e => this.setState({name: e.target.value})}
            value={name}
          />
          <p>{messages.project.createActionTooltip}</p>
          {bundles.length > 0
            ? <FormGroup id='select-bundle'>
              <Select
                clearable={false}
                id='select-bundle'
                options={bundles.map(bundle => ({
                  value: bundle._id, label: bundle.name
                }))}
                onChange={option =>
                  this.setState({bundleId: option.value})}
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

          <Button
            block
            disabled={!readyToCreate}
            onClick={this._create}
            style='success'
          >
            {messages.project.createAction}
          </Button>
        </Dock>
      </Application>
    )
  }
}
