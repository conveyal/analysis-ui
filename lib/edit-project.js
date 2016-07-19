import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {create, saveToServer} from './actions/project'
import {Button} from './components/buttons'
import Icon from './components/icon'
import Panel, {Body, Heading} from './components/panel'
import {Text} from './components/input'
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

function mapDispatchToProps (dispatch) {
  return {
    create: (opts) => dispatch(create(opts)),
    save: (opts) => dispatch(saveToServer(opts))
  }
}

class EditProject extends Component {
  static propTypes = {
    bounds: PropTypes.shape({
      north: PropTypes.number,
      east: PropTypes.number,
      south: PropTypes.number,
      west: PropTypes.number
    }),
    create: PropTypes.func.isRequired,
    description: PropTypes.string,
    id: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    name: PropTypes.string,
    r5Version: PropTypes.string
  }

  state = {
    bounds: this.props.bounds || {},
    description: this.props.description,
    id: this.props.id,
    name: this.props.name,
    r5Version: this.props.r5Version
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

  render () {
    const {create, isEditing, save} = this.props
    const {bounds, description, name, r5Version} = this.state
    const action = isEditing ? messages.project.editAction : messages.project.createAction
    const title = isEditing ? messages.project.editTitle : messages.project.createTitle
    const submit = isEditing ? save : create

    return (
      <Panel>
        <Heading>{title}</Heading>
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
            <Button
              className='pull-right'
              >
              <Icon type='crosshairs' />
            </Button>
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
            onClick={() => submit(this.state)}
            style='success'
            >{action}
          </Button>
        </Body>
      </Panel>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
