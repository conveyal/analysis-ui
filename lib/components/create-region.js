// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React, {Component} from 'react'

import {DEFAULT_BOUNDS} from '../constants/region'

import {Application, Dock, Title} from './base'
import {Button} from './buttons'
import {Text, File} from './input'
import EditBounds from './map/edit-bounds'
import LabelLayer from './map/label-layer'
import {fromLatLngBounds, toLatLngBounds} from '../utils/bounds'

const cardinalDirections = ['North', 'South', 'East', 'West']

type Props = {
  create: (region: any) => void
}

export default class CreateRegion extends Component {
  props: Props

  state = {
    customOpenStreetMapData: undefined,
    error: undefined,
    uploading: false,
    bounds: toLatLngBounds(DEFAULT_BOUNDS),
    description: '',
    name: undefined
  }

  onChangeDescription = (e: Event & {target: HTMLInputElement}) =>
    this.setState({description: e.target.value})
  onChangeName = (e: Event & {target: HTMLInputElement}) =>
    this.setState({name: e.target.value})

  _changeCustomOsm = (e: Event & {target: HTMLInputElement}) => {
    this.setState({customOpenStreetMapData: e.target.files[0]})
  }

  _create = () => {
    // Create/save will redirect to the region status page
    this.setState({uploading: true})
    this.props.create({
      ...this.state,
      bounds: fromLatLngBounds(this.state.bounds)
    })
  }

  _setBoundsFor = (direction: string) => (e: SyntheticInputEvent) => {
    const bounds = fromLatLngBounds(this.state.bounds)
    bounds[direction] = e.target.value
    const newBounds = toLatLngBounds(bounds)
    if (newBounds.isValid()) {
      this.setState({bounds: newBounds})
    } else {
      this.setState({
        error: `Value ${e.target.value} for ${direction} is invalid.`
      })
    }
  }

  _readyToCreate () {
    const {bounds, customOpenStreetMapData, name} = this.state
    return bounds.isValid() && customOpenStreetMapData && name && name.length > 0
  }

  _map = () =>
    <g>
      <LabelLayer />
      <EditBounds
        bounds={this.state.bounds}
        save={bounds => this.setState({bounds})}
      />
    </g>

  render () {
    const {bounds, description, name, uploading} = this.state
    const readyToCreate = this._readyToCreate()
    return (
      <Application map={this._map}>
        <Title><Icon type='map-o' /> {message('region.createAction')}</Title>
        <Dock>
          <Text
            label={message('region.name') + '*'}
            name={message('region.name')}
            onChange={this.onChangeName}
            value={name}
          />
          <Text
            label={message('region.description')}
            name={message('region.description')}
            onChange={this.onChangeDescription}
            value={description}
          />
          <h5>{message('region.osmBounds')}</h5>
          {cardinalDirections.map(direction => (
            <Text
              key={`bound-${direction}`}
              label={`${direction} bound`}
              name={`${direction} bound`}
              onChange={this._setBoundsFor(direction.toLowerCase())}
              value={bounds[`get${direction}`]()}
            />
          ))}

          osmconvert crop command
          <div className='alert alert-info all-copy'>
            {'osmconvert [file].pbf -b="' +
            bounds['west'] + ', ' +
            bounds['south'] + ', ' +
            bounds['east'] + ', ' +
            bounds['north'] +
            '"--complete-ways -o=[file]-cropped.pbf'}
          </div>

          <File
            label={message('region.customOpenStreetMapData')}
            name='customOpenStreetMapData'
            onChange={this._changeCustomOsm}
          />

          <Button
            block
            disabled={!readyToCreate || uploading}
            onClick={this._create}
            name={message('region.createAction')}
            style='success'
          >
            <Icon type='check' /> {message('region.createAction')}
          </Button>
        </Dock>
      </Application>
    )
  }
}
