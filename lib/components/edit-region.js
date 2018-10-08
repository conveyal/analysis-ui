// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React from 'react'

import type {Region, LonLat} from '../types.js'

import {Application, Dock, Title} from './base'
import {Button} from './buttons'
import {Text} from './input'
import EditBounds from './map/edit-bounds'
import {fromLatLngBounds, toLatLngBounds} from '../utils/bounds'
import reprojectCoordinates from '../utils/reproject-coordinates'

const cardinalDirections = ['North', 'South', 'East', 'West']

type Props = {
  deleteRegion: () => void,
  load: (string) => void,
  region: Region,
  save: (region: Region) => void,
  setCenter: (LonLat) => void,
  setLocally: (Object) => void
}

export default class EditRegion extends React.Component {
  props: Props
  _created: boolean
  _hasBeenDeleted: boolean

  state = {
    saving: !!this.props.region.statusCode && this.props.region.statusCode !== 'DONE',
    error: undefined
  }

  componentWillUnmount () {
    const p = this.props

    if (!this._hasBeenDeleted) {
      p.load(p.region._id) // if changes weren't saved, fetch them back from the server
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({
      saving: !!nextProps.region.statusCode && nextProps.region.statusCode !== 'DONE'
    })
  }

  onChangeDescription = (e: SyntheticInputEvent) =>
    this.onChange({description: e.target.value})
  onChangeName = (e: SyntheticInputEvent) =>
    this.onChange({name: e.target.value})

  onChange (updatedFields: {[any]: any}) {
    const {region, setLocally} = this.props

    // set it locally so that state is shared with bounds editor
    setLocally({
      ...region,
      ...updatedFields
    })
  }

  _save = () => {
    const p = this.props
    this.setState({saving: true})

    // Save will redirect back to main region page when complete
    const b = p.region.bounds
    const nw = reprojectCoordinates([b.north, b.west])
    const se = reprojectCoordinates([b.south, b.east])
    p.save({
      ...p.region,
      bounds: {
        north: nw.lat,
        west: nw.lng,
        south: se.lat,
        east: se.lng
      }
    })
  }

  _delete = () => {
    if (window.confirm(message('region.deleteConfirmation'))) {
      this._hasBeenDeleted = true
      this.props.deleteRegion()
    }
  }

  _setBoundsFor = (direction: string) => (e: SyntheticInputEvent) => {
    const {bounds} = this.props.region
    const value = e.target.value
    bounds[direction] = value
    const latLngBounds = toLatLngBounds(bounds)
    if (!latLngBounds.isValid()) {
      return this.setState({
        error: `Value ${value} for ${direction} is invalid.`
      })
    }

    this.onChange({bounds: {
      ...bounds,
      [direction]: value
    }})
  }

  _readyToCreate () {
    const {bounds, name} = this.props.region
    return toLatLngBounds(bounds).isValid() && name && name.length > 0
  }

  _map = () =>
    <EditBounds
      bounds={toLatLngBounds(this.props.region.bounds)}
      save={bounds => this.onChange({
        bounds: fromLatLngBounds(bounds)
      })}
    />

  render () {
    const {region} = this.props
    const {saving} = this.state
    const readyToCreate = this._readyToCreate()
    const buttonText = saving
      ? <span>
        <Icon className='fa-spin' type='spinner' />{' '}
        {message(`region.statusCode.${region.statusCode}`)}
      </span>
      : message('region.editAction')

    return (
      <Application map={this._map}>
        <Title>{message('region.editTitle')}</Title>
        <Dock>
          <Text
            label={message('region.name') + '*'}
            name={message('region.name')}
            onChange={this.onChangeName}
            value={region.name}
          />
          <Text
            label={message('region.description')}
            name={message('region.description')}
            onChange={this.onChangeDescription}
            value={region.description || ''}
          />
          <h5>{message('region.bounds')}</h5>
          {cardinalDirections.map(direction => (
            <Text
              key={`bound-${direction}`}
              label={`${direction} bound`}
              name={`${direction} bound`}
              onChange={this._setBoundsFor(direction.toLowerCase())}
              value={region.bounds[direction.toLowerCase()]}
            />
          ))}

          <p><em>{message('region.updatesDisabled')}</em></p>

          <Button
            block
            disabled={!readyToCreate || saving}
            onClick={this._save}
            name={message('region.editAction')}
            style='success'
          >
            {buttonText}
          </Button>

          <Button block onClick={this._delete} style='danger'>
            <Icon type='trash' /> {message('region.deleteAction')}
          </Button>
        </Dock>
      </Application>
    )
  }
}
