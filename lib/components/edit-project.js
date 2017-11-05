// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import {Text, File} from './input'
import messages from '../utils/messages'
import R5Version from './r5-version'

import type {Bounds, Project, LonLat} from '../types.js'

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
  _id: string,
  allVersions: string[],
  bounds: Bounds,
  description: string,
  // we don't actually use opportunityDatasets, just need them so we can re-save them with the project, hence any type
  opportunityDatasets: any,
  isEditing: boolean,
  loadStatus: ?string,
  name: string,
  r5Version: string,
  releaseVersions: string[],

  // actions
  addComponentToMap(): void,
  clearUncreatedProject(void): void,
  create(Object): void,
  deleteProject(): void,
  load(string): void,
  loadR5Versions(): void,
  removeComponentFromMap(): void,
  save: ({project: Project, customOpenStreetMapData: ?Object}) => void,
  setCenter(LonLat): void,
  setLocally(Object): void
}

type State = Props & {
  customOpenStreetMapData: any,
  saving: boolean,
  error: void | string
}

export default class EditProject extends Component<void, Props, State> {
  _created: boolean
  _hasBeenDeleted: boolean

  state = {
    ...this.props,
    saving: !!this.props.loadStatus && this.props.loadStatus !== 'DONE',
    customOpenStreetMapData: undefined,
    error: undefined
  }

  componentDidMount () {
    const {
      addComponentToMap,
      allVersions,
      bounds,
      isEditing,
      loadR5Versions,
      setLocally
    } = this.props
    if (!allVersions || allVersions.length === 0) {
      loadR5Versions()
    }

    if (!isEditing) {
      setLocally({bounds})
    }

    addComponentToMap()
  }

  componentWillUnmount () {
    const {
      clearUncreatedProject,
      isEditing,
      load,
      removeComponentFromMap
    } = this.props
    removeComponentFromMap()
    if (isEditing && !this._hasBeenDeleted) {
      load(this.props._id) // if changes weren't saved, fetch them back from the server
    }
    clearUncreatedProject()
  }

  componentWillReceiveProps (nextProps: any) {
    this.setState({
      ...nextProps,
      saving: nextProps.loadStatus && nextProps.loadStatus !== 'DONE'
    })
  }

  onChangeDescription = (e: Event & {target: HTMLInputElement}) =>
    this.onChange({description: e.target.value})
  onChangeName = (e: Event & {target: HTMLInputElement}) =>
    this.onChange({name: e.target.value})
  onChangeR5Version = (item: {value: string}) =>
    this.onChange({r5Version: item.value})

  onChange (updatedFields: {[any]: any}) {
    const {
      bounds,
      description,
      _id,
      name,
      r5Version,
      setLocally,
      opportunityDatasets
    } = this.props
    // set it locally so that state is shared with bounds editor
    setLocally({
      bounds,
      description,
      _id,
      name,
      opportunityDatasets,
      r5Version,
      ...updatedFields
    })

    this.setState({...updatedFields})
  }

  _changeCustomOsm = (e: Event & {target: HTMLInputElement}) => {
    this.setState({customOpenStreetMapData: e.target.files[0]})
  }

  _createOrSave = () => {
    const {
      bounds,
      create,
      description,
      _id,
      isEditing,
      name,
      r5Version,
      opportunityDatasets,
      save
    } = this.props
    const {customOpenStreetMapData} = this.state

    this.setState({saving: true})

    // Create/save will redirect back to main project page when complete
    if (isEditing) {
      save({
        project: {
          bounds,
          description,
          _id,
          name,
          r5Version,
          opportunityDatasets
        },
        customOpenStreetMapData
      })
    } else {
      this._created = true
      create({
        project: {
          bounds,
          description,
          name,
          r5Version,
          opportunityDatasets
        },
        customOpenStreetMapData
      })
    }
  }

  _delete = () => {
    if (window.confirm(messages.region.deleteConfirmation)) {
      this._hasBeenDeleted = true
      this.props.deleteProject()
    }
  }

  _setBoundsFor = memoize((direction: string) => (e: Event & {target: HTMLInputElement}) => {
    const {bounds} = this.props
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

  render () {
    if (this.props.isEditing) {
      return this.renderBody()
    } else {
      return (
        <div>
          <div className='ApplicationDockTitle'>
            <Icon type='cubes' /> {messages.region.createAction}
          </div>
          {this.renderBody()}
        </div>
      )
    }
  }

  _readyToCreate () {
    const {bounds} = this.props
    const {name} = this.state
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

  renderBody () {
    const {
      allVersions,
      bounds,
      description,
      isEditing,
      r5Version,
      loadStatus,
      releaseVersions
    } = this.props
    const {name, saving} = this.state
    const readyToCreate = this._readyToCreate()
    const buttonText = saving
      ? <span>
        <Icon className='fa-spin' type='spinner' />{' '}
        {messages.region.loadStatus[loadStatus]}
      </span>
      : isEditing ? messages.region.editAction : messages.region.createAction

    return (
      <InnerDock>
        <div className='block'>
          <Text
            label={messages.region.name + '*'}
            name={messages.region.name}
            onChange={this.onChangeName}
            value={name}
          />
          <Text
            label={messages.region.description}
            name={messages.region.description}
            onChange={this.onChangeDescription}
            value={description}
          />
          <R5Version
            label={messages.region.r5Version}
            name={messages.region.r5Version}
            onChange={this.onChangeR5Version}
            value={r5Version}
            allVersions={allVersions}
            releaseVersions={releaseVersions}
          />
          <h5>{messages.region.osmBounds}</h5>
          {cardinalDirections.map(direction => (
            <Text
              key={`bound-${direction}`}
              label={`${direction} bound`}
              name={`${direction} bound`}
              onChange={this._setBoundsFor(direction.toLowerCase())}
              value={bounds[direction.toLowerCase()]}
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
            onClick={this._createOrSave}
            name={messages.region.editAction}
            style='success'
          >
            {buttonText}
          </Button>

          {isEditing &&
            <Button block onClick={this._delete} style='danger'>
              <Icon type='trash' /> {messages.region.deleteAction}
            </Button>}
        </div>
      </InnerDock>
    )
  }
}
