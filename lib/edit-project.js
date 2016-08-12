import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addComponent, removeComponent, setCenter} from './actions/map'
import {deleteProject, save} from './actions/project'
import {Button} from './components/buttons'
import DeepEqualComponent from './components/deep-equal'
import Icon from './components/icon'
import Panel, {Body, Heading} from './components/panel'
import {Text} from './components/input'
import {EDIT_PROJECT_BOUNDS_COMPONENT} from './constants/map'
import messages from './messages'

const cardinalDirections = ['North', 'South', 'East', 'West']

function mapStateToProps ({
  project
}, {
  params
}) {
  const id = params.projectId
  const currentProject = project.projectsById[id] || {}
  return {
    bounds: currentProject.bounds,
    description: currentProject.description,
    id,
    isEditing: !!id,
    name: currentProject.name,
    r5Version: currentProject.r5Version
  }
}

function mapDispatchToProps (dispatch, {
  params
}) {
  return {
    addComponentToMap: () => dispatch(addComponent(EDIT_PROJECT_BOUNDS_COMPONENT)),
    deleteProject: () => dispatch(deleteProject(params.projectId)),
    removeComponentFromMap: () => dispatch(removeComponent(EDIT_PROJECT_BOUNDS_COMPONENT)),
    save: (opts) => dispatch([save(opts), push(`/projects/${params.projectId}`)]),
    setCenter: (c) => dispatch(setCenter(c))
  }
}

class EditProject extends DeepEqualComponent {
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
