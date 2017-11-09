// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import {Button} from './buttons'
import {CREATING_ID} from '../constants/project'
import InnerDock from './inner-dock'
import {Text, File} from './input'
import messages from '../utils/messages'
import R5Version from './r5-version'

import type {Project, LonLat} from '../types.js'

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
  allVersions: string[],
  project: Project,
  releaseVersions: string[],

  // actions
  addComponentToMap: () => void,
  clearUncreatedProject: (void) => void,
  create: ({project: Project, customOpenStreetMapData: ?Object}) => void,
  deleteProject: () => void,
  load: (string) => void,
  loadR5Versions: () => void,
  removeComponentFromMap: () => void,
  save: ({project: Project, customOpenStreetMapData: ?Object}) => void,
  setCenter: (LonLat) => void,
  setLocally: (Object) => void
}

export default class EditProject extends Component {
  props: Props
  _created: boolean
  _hasBeenDeleted: boolean

  state = {
    saving: !!this.props.project.statusCode && this.props.project.statusCode !== 'DONE',
    customOpenStreetMapData: undefined,
    error: undefined
  }

  isEditing () {
    return this.props.project._id !== CREATING_ID
  }

  componentDidMount () {
    const {
      addComponentToMap,
      allVersions,
      loadR5Versions,
      project,
      setLocally
    } = this.props
    if (!allVersions || allVersions.length === 0) {
      loadR5Versions()
    }

    if (!this.isEditing()) setLocally(project)

    addComponentToMap()
  }

  componentWillUnmount () {
    const {
      clearUncreatedProject,
      load,
      project,
      removeComponentFromMap
    } = this.props
    removeComponentFromMap()

    if (this.isEditing() && !this._hasBeenDeleted) {
      load(project._id) // if changes weren't saved, fetch them back from the server
    }

    clearUncreatedProject()
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({
      saving: !!nextProps.project.statusCode && nextProps.project.statusCode !== 'DONE'
    })
  }

  onChangeDescription = (e: Event & {target: HTMLInputElement}) =>
    this.onChange({description: e.target.value})
  onChangeName = (e: Event & {target: HTMLInputElement}) =>
    this.onChange({name: e.target.value})
  onChangeR5Version = (item: {value: string}) =>
    this.onChange({r5Version: item.value})

  onChange (updatedFields: {[any]: any}) {
    const {project, setLocally} = this.props

    // set it locally so that state is shared with bounds editor
    setLocally({
      ...project,
      ...updatedFields
    })
  }

  _changeCustomOsm = (e: Event & {target: HTMLInputElement}) => {
    this.setState({customOpenStreetMapData: e.target.files[0]})
  }

  _createOrSave = () => {
    const {
      create,
      project,
      releaseVersions,
      save
    } = this.props
    const {customOpenStreetMapData} = this.state

    this.setState({saving: true})

    // Create/save will redirect back to main project page when complete
    if (this.isEditing()) {
      save({
        project,
        customOpenStreetMapData
      })
    } else {
      this._created = true
      create({
        project: {
          r5Version: project.r5Version || releaseVersions[0],
          ...project
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
    const {bounds} = this.props.project
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
    if (this.isEditing()) {
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
    const {bounds, name} = this.props.project
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
      project,
      releaseVersions
    } = this.props
    const {saving} = this.state
    const readyToCreate = this._readyToCreate()
    const buttonText = saving
      ? <span>
        <Icon className='fa-spin' type='spinner' />{' '}
        {messages.region.statusCode[project.statusCode]}
      </span>
      : this.isEditing() ? messages.region.editAction : messages.region.createAction

    return (
      <InnerDock>
        <div className='block'>
          <Text
            label={messages.region.name + '*'}
            name={messages.region.name}
            onChange={this.onChangeName}
            value={project.name}
          />
          <Text
            label={messages.region.description}
            name={messages.region.description}
            onChange={this.onChangeDescription}
            value={project.description}
          />
          <R5Version
            label={messages.region.r5Version}
            name={messages.region.r5Version}
            onChange={this.onChangeR5Version}
            value={project.r5Version || releaseVersions[0]}
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
              value={project.bounds[direction.toLowerCase()]}
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

          {this.isEditing() &&
            <Button block onClick={this._delete} style='danger'>
              <Icon type='trash' /> {messages.region.deleteAction}
            </Button>}
        </div>
      </InnerDock>
    )
  }
}
