// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import memoize from 'lodash/memoize'
import React from 'react'

import {Application, Dock, Title} from './base'
import {Button} from './buttons'
import {Text} from './input'
import EditBounds from './map/edit-bounds'

import type {Region, LonLat} from '../types.js'

const cardinalDirections = ['North', 'South', 'East', 'West']

function parseLon (val) {
  const lon = parseFloat(val)
  if (isNaN(lon) || lon < -180 || lon > 180) {
    throw new Error('Invalid longtitude.')
  }
  return lon
}

function parseLat (val) {
  const lat = parseFloat(val)
  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude.')
  }
  return lat
}

type Props = {
  region: Region,

  // actions
  deleteRegion: () => void,
  load: (string) => void,
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
    const {
      load,
      region
    } = this.props

    if (!this._hasBeenDeleted) {
      load(region._id) // if changes weren't saved, fetch them back from the server
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({
      saving: !!nextProps.region.statusCode && nextProps.region.statusCode !== 'DONE'
    })
  }

  onChangeDescription = (e: Event & {target: HTMLInputElement}) =>
    this.onChange({description: e.target.value})
  onChangeName = (e: Event & {target: HTMLInputElement}) =>
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
    this.setState({saving: true})

    // Save will redirect back to main region page when complete
    this.props.save(this.props.region)
  }

  _delete = () => {
    if (window.confirm(message('region.deleteConfirmation'))) {
      this._hasBeenDeleted = true
      this.props.deleteRegion()
    }
  }

  _setBoundsFor = memoize((direction: string) => (e: Event & {target: HTMLInputElement}) => {
    const {bounds} = this.props.region
    let value = e.target.value
    try {
      value = direction === 'north' || direction === 'south'
        ? parseLat(value)
        : parseLon(value)
    } catch (e) {
      this.setState({
        error: e.message
      })
    }

    this.onChange({bounds: {
      ...bounds,
      [direction]: value
    }})
  })

  _readyToCreate () {
    const {bounds, name} = this.props.region
    try {
      parseLat(bounds.north)
      parseLat(bounds.south)
      parseLon(bounds.east)
      parseLon(bounds.west)
      return name && name.length > 0
    } catch (e) {
      return false
    }
  }

  _map = () =>
    <EditBounds
      bounds={this.props.region.bounds}
      save={bounds => this.onChange({bounds})}
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
