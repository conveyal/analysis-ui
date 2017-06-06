// @flow
import React, {PureComponent} from 'react'

import {Button} from './buttons'
import Icon from './icon'
import {Body, Heading, Panel} from './panel'
import {Text} from './input'
import messages from '../utils/messages'
import R5Version from './r5-version'

const cardinalDirections = ['North', 'South', 'East', 'West']

type Props = {
  allVersions: string[],
  bounds: {
    north: number,
    east: number,
    south: number,
    west: number
  },
  description: string,
  id: string,
  indicators: string[],
  isEditing: boolean,
  loadStatus: string,
  name: string,
  r5Version: string,
  releaseVersions: string[],

  // actions
  addComponentToMap(): void,
  create(): void,
  clearUncreatedProject(): void,
  deleteProject(): void,
  fetch(): void,
  load(): void,
  removeComponentFromMap(): void,
  save(): void,
  setCenter(): void,
  setLocally(): void
}

type State = any

export default class EditProject extends PureComponent<void, Props, State> {
  _created: boolean
  _hasBeenDeleted: boolean
  state = {...this.props, saving: false}

  componentDidMount () {
    if (this.props.bounds) {
      this.props.addComponentToMap()
    }
  }

  componentWillUnmount () {
    const {clearUncreatedProject, isEditing, load, removeComponentFromMap} = this.props
    removeComponentFromMap()
    if (isEditing && !this._hasBeenDeleted) {
      load(this.props.id) // if changes weren't saved, fetch them back from the server
    }
    clearUncreatedProject()
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({...nextProps})
  }

  onChangeDescription = (e: Event & {target: HTMLInputElement}) =>
    this.onChange({ description: e.target.value })
  onChangeName = (e: Event & {target: HTMLInputElement}) =>
    this.onChange({ name: e.target.value })
  onChangeR5Version = (item: {value: string}) =>
    this.onChange({ r5Version: item.value })

  onChange (updatedFields: {[any]: any}) {
    const { bounds, description, id, name, r5Version, setLocally, indicators } = this.props
    // set it locally so that state is shared with bounds editor
    setLocally({
      bounds,
      description,
      id,
      name,
      indicators,
      r5Version,
      ...updatedFields
    })

    this.setState({...updatedFields})
  }

  _createOrSave = () => {
    const {bounds, create, description, id, isEditing, name, r5Version, indicators, save} = this.props

    this.setState({saving: true})

    // Create/save will redirect back to main project page when complete
    if (isEditing) {
      save({
        bounds,
        description,
        id,
        name,
        r5Version,
        indicators
      })
    } else {
      this._created = true
      create({
        bounds,
        description,
        name,
        r5Version,
        indicators
      })
    }
  }

  _delete = () => {
    if (window.confirm(messages.project.deleteConfirmation)) {
      this._hasBeenDeleted = true
      this.props.deleteProject()
    }
  }

  render () {
    const {allVersions, bounds, fetch, description, isEditing, r5Version, loadStatus, releaseVersions} = this.props
    const {name, saving} = this.state
    const readyToCreate = name && name.length > 0
    const buttonText = saving
      ? <span><Icon className='fa-spin' type='spinner' /> {messages.project.loadStatus[loadStatus]}</span>
      : isEditing
        ? messages.project.editAction
        : messages.project.createAction

    return (
      <Panel>
        <Heading>{messages.project.editTitle}</Heading>
        <Body>
          <Text
            label='Project Name'
            name='Project Name'
            onChange={this.onChangeName}
            value={name}
            />
          <Text
            label='Description'
            name='Description'
            onChange={this.onChangeDescription}
            value={description}
            />
          <R5Version
            fetch={fetch}
            label={messages.project.r5Version}
            name={messages.project.r5Version}
            onChange={this.onChangeR5Version}
            value={r5Version}
            allVersions={allVersions}
            releaseVersions={releaseVersions}
            />
          <legend>
            OSM Bounds
          </legend>
          {cardinalDirections.map((direction) =>
            <Text
              key={`bound-${direction}`}
              label={`${direction} bound`}
              name={`${direction} bound`}
              disabled
              value={bounds[direction.toLowerCase()]}
              />)}

          <Button
            block
            disabled={!readyToCreate || saving}
            onClick={this._createOrSave}
            name='Save Project'
            style='success'
            >{buttonText}
          </Button>
          {isEditing &&
            <Button
              block
              onClick={this._delete}
              style='danger'
              ><Icon type='trash' /> {messages.project.deleteAction}
            </Button>
          }
        </Body>
      </Panel>
    )
  }
}
