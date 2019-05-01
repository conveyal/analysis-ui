import {faCopy, faUpload} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import ProjectTitle from 'lib/containers/project-title'
import message from 'lib/message'

import Select from './select'
import Icon from './icon'
import {Application, Dock} from './base'
import {Button} from './buttons'

export default function ImportModifications(p) {
  const [importProjectId, setImportProjectId] = React.useState()

  return (
    <Application>
      <ProjectTitle />
      <Dock>
        <h5>{message('modification.importFromShapefile')}</h5>
        <Button
          block
          name={message('project.importAction')}
          onClick={p.goToImportShapefile}
          style='success'
        >
          <Icon icon={faUpload} /> {message('project.importAction')}
        </Button>
        <br />
        <h5>{message('modification.importFromProject')}</h5>
        <p>{message('modification.importFromProjectInfo')}</p>
        <div className='form-group'>
          <Select
            clearable={false}
            onChange={project => setImportProjectId(project.value)}
            options={p.projects.map(p => ({value: p._id, label: p.name}))}
            placeholder={message('project.select')}
            value={importProjectId}
          />
        </div>
        <Button
          block
          disabled={!importProjectId}
          name={message('project.importAction')}
          onClick={() => p.copyFromProject(importProjectId)}
          style='success'
        >
          <Icon icon={faCopy} /> {message('project.importAction')}
        </Button>
      </Dock>
    </Application>
  )
}
