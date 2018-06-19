// @flow
import React, {PureComponent} from 'react'

import {Application, Dock, Title} from './base'
import {Button} from './buttons'
import {Group as FormGroup, Text} from './input'
import messages from '../utils/messages'

import type {Project} from '../types'

type Props = {
  bundleName: string,
  project: Project,

  close: (any) => void,
  save: (any) => void
}

export default class EditProject extends PureComponent {
  props: Props

  state = {
    name: this.props.project.name
  }

  componentWillReceiveProps (newProps: Props) {
    this.setState({name: newProps.project.name})
  }

  _save = () => {
    const {close, project, save} = this.props
    const {name} = this.state
    if (name) {
      save({...project, name})
      close()
    }
  }

  render () {
    return (
      <Application>
        <Title>
          {messages.project.editTitle}
        </Title>
        <Dock>
          <Text
            name={messages.project.name}
            onChange={e => this.setState({name: e.target.value})}
            value={this.state.name}
          />
          <FormGroup>
            <strong>Bundle:</strong> {this.props.bundleName} <br />
            <small>Bundle cannot be changed once a project is created</small>
          </FormGroup>
          <Button
            block
            onClick={this._save}
            style='success'
          >
            {messages.project.editAction}
          </Button>
        </Dock>
      </Application>
    )
  }
}
