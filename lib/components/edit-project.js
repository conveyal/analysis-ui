import React, {PropTypes} from 'react'

import {Button} from './buttons'
import DeepEqualComponent from './deep-equal'
import Icon from './icon'
import Panel, {Body, Heading} from './panel'
import {Text} from './input'
import messages from '../utils/messages'

const cardinalDirections = ['North', 'South', 'East', 'West']

export default class EditProject extends DeepEqualComponent {
  static propTypes = {
    addComponentToMap: PropTypes.func.isRequired,
    bounds: PropTypes.shape({
      north: PropTypes.number,
      east: PropTypes.number,
      south: PropTypes.number,
      west: PropTypes.number
    }),
    description: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    r5Version: PropTypes.string,
    removeComponentFromMap: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    setCenter: PropTypes.func.isRequired
  }

  state = {
    bounds: this.props.bounds || {},
    description: this.props.description,
    id: this.props.id,
    name: this.props.name,
    r5Version: this.props.r5Version
  }

  componentDidMount () {
    if (this.props.bounds) {
      this.props.addComponentToMap()
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      bounds: newProps.bounds || {},
      description: newProps.description,
      id: newProps.id,
      name: newProps.name,
      r5Version: newProps.r5Version
    })

    if (newProps.bounds) {
      this.props.addComponentToMap()
    }
  }

  componentWillUnmount () {
    this.props.removeComponentFromMap()
  }

  onChangeDescription = (e) => {
    this.setState({
      ...this.state,
      description: e.target.value
    })
  }

  onChangeName = (e) => {
    this.setState({
      ...this.state,
      name: e.target.value
    })
  }

  onChangeR5Version = (e) => {
    this.setState({
      ...this.state,
      r5Version: e.target.value
    })
  }

  _save = (e) => {
    this.props.save(this.state)
  }

  _delete = () => {
    if (window.confirm(messages.project.deleteConfirmation)) {
      this.props.deleteProject()
    }
  }

  render () {
    const {bounds, description, name, r5Version} = this.state
    return (
      <Panel>
        <Heading>{messages.project.editTitle}</Heading>
        <Body>
          <Text
            label='Name'
            onChange={this.onChangeName}
            value={name}
            />
          <Text
            label='Description'
            onChange={this.onChangeDescription}
            value={description}
            />
          <Text
            label='R5 Version'
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
              onChange={(e) => {
                const bounds = {...this.state.bounds}
                bounds[direction.toLowerCase()] = parseFloat(e.target.value)
                this.setState({
                  ...this.state,
                  bounds
                })
              }}
              value={bounds[direction.toLowerCase()]}
              />)}
          <Button
            block
            onClick={this._save}
            style='success'
            >{messages.project.editAction}
          </Button>
          <Button
            block
            onClick={this._delete}
            style='danger'
            ><Icon type='trash' /> {messages.project.deleteAction}
          </Button>
        </Body>
      </Panel>
    )
  }
}
