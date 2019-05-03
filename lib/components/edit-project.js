import {faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteProject, saveToServer} from 'lib/actions/project'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import {Application, Dock, Title} from './base'
import {Button} from './buttons'
import Icon from './icon'
import {Group as FormGroup, Text} from './input'

export default function EditProject(p) {
  const dispatch = useDispatch()
  const [name, setName] = React.useState(p.project.name)

  function _deleteProject() {
    if (window.confirm(message('project.deleteConfirmation'))) {
      dispatch(deleteProject(p.projectId)).then(() => {
        Router.routeTo({
          pathname: RouteTo.projects,
          query: {regionId: p.project.regionId}
        })
      })
    }
  }

  function _save() {
    dispatch(saveToServer({...p.project, name})).then(() => {
      Router.routeTo({
        pathname: RouteTo.modifications,
        query: {projectId: p.project._id, regionId: p.project.regionId}
      })
    })
  }

  return (
    <Application>
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
        <Button
          disabled={!name || p.project.name === name}
          block
          onClick={_save}
          style='success'
        >
          <Icon icon={faSave} /> {message('project.editAction')}
        </Button>
        <Button block onClick={_deleteProject} style='danger'>
          <Icon icon={faTrash} /> {message('project.delete')}
        </Button>
      </Dock>
    </Application>
  )
}
