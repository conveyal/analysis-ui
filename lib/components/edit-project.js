import {faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import {withRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteProject, saveToServer} from 'lib/actions/project'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import {Button} from './buttons'
import Icon from './icon'
import InnerDock from './inner-dock'
import {Group as FormGroup, Text} from './input'

function EditProject(p) {
  const dispatch = useDispatch()
  const [name, setName] = React.useState(p.project.name)

  function _deleteProject() {
    if (window.confirm(message('project.deleteConfirmation'))) {
      dispatch(deleteProject(p.project._id)).then(() => {
        p.router.push({
          pathname: RouteTo.projects,
          query: {regionId: p.project.regionId}
        })
      })
    }
  }

  function _save() {
    dispatch(saveToServer({...p.project, name})).then(() => {
      p.router.push({
        pathname: RouteTo.modifications,
        query: {projectId: p.project._id, regionId: p.project.regionId}
      })
    })
  }

  return (
    <InnerDock className='block'>
      <legend>{message('project.editSettings')}</legend>
      <Text
        label={message('project.name')}
        onChange={e => setName(e.target.value)}
        value={name}
      />
      <FormGroup label='Bundle'>
        <p>{p.bundleName}</p>
        <p>
          <em>Bundle cannot be changed once a project is created.</em>
        </p>
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
    </InnerDock>
  )
}

// Expose next/router to EditProject
export default withRouter(EditProject)
