// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import {Text, File} from './input'
import messages from '../utils/messages'

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
  addComponentToMap: () => void,
  deleteRegion: () => void,
  load: (string) => void,
  removeComponentFromMap: () => void,
  save: ({region: Region, customOpenStreetMapData: ?Object}) => void,
  setCenter: (LonLat) => void,
  setLocally: (Object) => void
}

export default class EditRegion extends Component {
  props: Props
  _created: boolean
  _hasBeenDeleted: boolean

  state = {
    saving: !!this.props.region.statusCode && this.props.region.statusCode !== 'DONE',
    customOpenStreetMapData: undefined,
    error: undefined
  }

  componentDidMount () {
    const {
      addComponentToMap
    } = this.props

    addComponentToMap()
  }

  componentWillUnmount () {
    const {
      load,
      region,
      removeComponentFromMap
    } = this.props
    removeComponentFromMap()

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

  _changeCustomOsm = (e: Event & {target: HTMLInputElement}) => {
    this.setState({customOpenStreetMapData: e.target.files[0]})
  }

  _save = () => {
    const {
      region,
      save
    } = this.props
    const {customOpenStreetMapData} = this.state

    this.setState({saving: true})

    // Save will redirect back to main region page when complete
    save({
      region,
      customOpenStreetMapData
    })
  }

  _delete = () => {
    if (window.confirm(messages.region.deleteConfirmation)) {
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

  render () {
    const {
      region
    } = this.props
    const {saving} = this.state
    const readyToCreate = this._readyToCreate()
    const buttonText = saving
      ? <span>
        <Icon className='fa-spin' type='spinner' />{' '}
        {messages.region.statusCode[region.statusCode]}
      </span>
      : messages.region.editAction

    return (
      <InnerDock>
        <div className='block'>
          <Text
            label={messages.region.name + '*'}
            name={messages.region.name}
            onChange={this.onChangeName}
            value={region.name}
          />
          <Text
            label={messages.region.description}
            name={messages.region.description}
            onChange={this.onChangeDescription}
            value={region.description}
          />
          <h5>{messages.region.osmBounds}</h5>
          {cardinalDirections.map(direction => (
            <Text
              key={`bound-${direction}`}
              label={`${direction} bound`}
              name={`${direction} bound`}
              onChange={this._setBoundsFor(direction.toLowerCase())}
              value={region.bounds[direction.toLowerCase()]}
            />
          ))}

          <File
            label={messages.region.customOpenStreetMapData}
            name='customOpenStreetMapData'
            onChange={this._changeCustomOsm}
          />

          <Button
            block
            disabled={!readyToCreate || saving}
            onClick={this._save}
            name={messages.region.editAction}
            style='success'
          >
            {buttonText}
          </Button>

          <Button block onClick={this._delete} style='danger'>
            <Icon type='trash' /> {messages.region.deleteAction}
          </Button>
        </div>
      </InnerDock>
    )
  }
}
