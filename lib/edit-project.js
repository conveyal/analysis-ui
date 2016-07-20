import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addComponent, removeComponent} from './actions/map'
import {save} from './actions/project'
import {Button} from './components/buttons'
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
    removeComponentFromMap: () => dispatch(removeComponent(EDIT_PROJECT_BOUNDS_COMPONENT)),
    save: (opts) => dispatch([save(opts), push(`/projects/${params.projectId}`)])
  }
}

class EditProject extends Component {
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
    save: PropTypes.func.isRequired
  }

  state = {
    bounds: this.props.bounds || {},
    description: this.props.description,
    id: this.props.id,
    name: this.props.name,
    r5Version: this.props.r5Version
  }

  componentWillMount () {
    this.props.addComponentToMap()
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      bounds: newProps.bounds || {},
      description: newProps.description,
      id: newProps.id,
      name: newProps.name,
      r5Version: newProps.r5Version
    })
  }

  componentWillUnmount () {
    this.props.removeComponentFromMap()
  }

  render () {
    const {save} = this.props
    const {bounds, description, name, r5Version} = this.state

    return (
      <Panel>
        <Heading>{messages.project.editTitle}</Heading>
        <Body>
          <Text
            label='Name'
            onChange={(e) => this.setState({
              ...this.state,
              name: e.target.value
            })}
            value={name}
            />
          <Text
            label='Description'
            onChange={(e) => this.setState({
              ...this.state,
              description: e.target.value
            })}
            value={description}
            />
          <Text
            label='R5 Version'
            onChange={(e) => this.setState({
              ...this.state,
              r5Version: e.target.value
            })}
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
            onClick={() => save(this.state)}
            style='success'
            >{messages.project.editAction}
          </Button>
        </Body>
      </Panel>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
