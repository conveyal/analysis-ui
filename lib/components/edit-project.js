import {faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from '../message'

import {Application, Dock, Title} from './base'
import {Button} from './buttons'
import Icon from './icon'
import {Group as FormGroup, Text} from './input'

export default function EditProject(p) {
  const [name, setName] = React.useState(p.project.name)

  function deleteProject() {
    if (window.confirm(message('project.deleteConfirmation'))) {
      p.deleteProject()
    }
  }

  function save() {
    if (name) {
      p.save({...p.project, name})
      p.close()
    }
  }

  return (
    <Application {...p}>
      <Title>{message('project.editSettings')}</Title>
      <Dock>
        <Text
          name={message('project.name')}
          onChange={e => setName(e.target.value)}
          value={name}
        />
        <FormGroup>
          <strong>Bundle:</strong> {p.bundleName} <br />
          <small>Bundle cannot be changed once a project is created</small>
        </FormGroup>
        <Button block onClick={save} style='success'>
          <Icon icon={faSave} fixedWidth /> {message('project.editAction')}
        </Button>
        <Button block onClick={deleteProject} style='danger'>
          <Icon icon={faTrash} fixedWidth /> {message('project.delete')}
        </Button>
      </Dock>
    </Application>
  )
}
