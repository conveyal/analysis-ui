// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import {Button} from './buttons'
import {Body, Panel} from './panel'
import {Text, File} from './input'
import messages from '../utils/messages'
import R5Version from './r5-version'

import type {Bounds, Project, LonLat} from '../types.js'

const cardinalDirections = ['North', 'South', 'East', 'West']

type Props = {
  allVersions: string[],
  bounds: Bounds,
  description: string,
  id: string,
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
  saving: boolean
}

export default class EditProject extends Component<void, Props, State> {
  _created: boolean
  _hasBeenDeleted: boolean

  state = {
    ...this.props,
    saving: !!this.props.loadStatus && this.props.loadStatus !== 'DONE',
    customOpenStreetMapData: undefined
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
      load(this.props.id) // if changes weren't saved, fetch them back from the server
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
      id,
      name,
      r5Version,
      setLocally,
      opportunityDatasets
    } = this.props
    // set it locally so that state is shared with bounds editor
    setLocally({
      bounds,
      description,
      id,
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
      id,
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
          id,
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
    const readyToCreate = name && name.length > 0
    const buttonText = saving
      ? <span>
        <Icon className='fa-spin' type='spinner' />{' '}
        {messages.region.loadStatus[loadStatus]}
      </span>
      : isEditing ? messages.region.editAction : messages.region.createAction

    return (
      <div className='InnerDock'>
        <Panel>
          <Body>
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
                disabled
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
          </Body>
        </Panel>
      </div>
    )
  }
}
