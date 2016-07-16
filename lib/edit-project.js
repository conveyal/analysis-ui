import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {create} from './actions/project'
import {Button} from './components/buttons'
import Panel, {Body, Heading} from './components/panel'
import {Text} from './components/input'
import messages from './messages'

function mapStateToProps () {
  return {
    isEditing: false
  }
}

function mapDispatchToProps (dispatch) {
  return {
    create: (opts) => dispatch(create(opts))
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
    description: PropTypes.string,
    id: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    name: PropTypes.string,
    r5Version: PropTypes.string
  }

  state = {
    bounds: this.props.bounds,
    description: this.props.description,
    name: this.props.name,
    r5Version: this.props.r5Version
  }

  render () {
    const {isEditing} = this.props
    const {description, name} = this.state
    const action = isEditing ? messages.project.editAction : messages.project.createAction
    const title = isEditing ? messages.project.editTitle : messages.project.createTitle

    return (
      <Panel>
        <Heading>{title}</Heading>
        <Body>
          <Text
            name='Name'
            onChange={(e) => this.setState({
              ...this.state,
              name: e.target.value
            })}
            defaultValue={name}
            />
          <Text
            name='Description'
            onChange={(e) => this.setState({
              ...this.state,
              description: e.target.value
            })}
            defaultValue={description}
            />
          <Button
            block
            onClick={() => this.props.create(this.state)}
            style='success'
            >{action}
          </Button>

          <br />
        </Body>
      </Panel>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)
