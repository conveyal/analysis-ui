import React, {PropTypes} from 'react'

import {Button} from './buttons'
import DeepEqualComponent from './deep-equal'
import Icon from './icon'
import {Body, Heading, Panel} from './panel'
import {Text} from './input'
import messages from '../utils/messages'
import R5Version from './r5-version'

const cardinalDirections = ['North', 'South', 'East', 'West']

export default class EditProject extends DeepEqualComponent {
  static propTypes = {
    bounds: PropTypes.shape({
      north: PropTypes.number,
      east: PropTypes.number,
      south: PropTypes.number,
      west: PropTypes.number
    }).isRequired,
    description: PropTypes.string,
    id: PropTypes.string,
    indicators: PropTypes.array.isRequired,
    isEditing: PropTypes.bool.isRequired,
    name: PropTypes.string,
    r5Version: PropTypes.string,

    // actions
    addComponentToMap: PropTypes.func.isRequired,
    clearUncreatedProject: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    removeComponentFromMap: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    setCenter: PropTypes.func.isRequired,
    setLocally: PropTypes.func.isRequired
  }

  state = {...this.props}

  componentDidMount () {
    if (this.props.bounds) {
      this.props.addComponentToMap()
    }
  }

  componentWillUnmount () {
    const {clearUncreatedProject, isEditing, load, removeComponentFromMap} = this.props
    removeComponentFromMap()
    if (isEditing && !this.hasBeenDeleted) {
      load(this.props.id) // if changes weren't saved, fetch them back from the server
    }
    clearUncreatedProject()
  }

  componentWillReceiveProps (nextProps) {
    this.setState({...nextProps})
  }

  onChangeDescription = (e) => this.onChange({ description: e.target.value })
  onChangeName = (e) => this.onChange({ name: e.target.value })
  onChangeR5Version = (item) => this.onChange({ r5Version: item.value })

  onChange (updatedFields) {
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

    this.setState({
      ...this.state,
      ...updatedFields
    })
  }

  _createOrSave = (e) => {
    const {bounds, create, description, id, isEditing, name, r5Version, indicators, save} = this.props
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
      this.hasBeenDeleted = true
      this.props.deleteProject()
    }
  }

  render () {
    const {bounds, fetch, description, isEditing, r5Version} = this.props
    const {name} = this.state
    const readyToCreate = name && name.length > 0
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
            disabled={!readyToCreate}
            onClick={this._createOrSave}
            name='Save Project'
            style='success'
            >{isEditing ? messages.project.editAction : messages.project.createAction}
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
