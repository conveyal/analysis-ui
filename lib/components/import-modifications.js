import {faCopy, faUpload} from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {copyFromProject} from 'lib/actions/modifications'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import Select from './select'
import Icon from './icon'
import {Button, ButtonLink} from './buttons'

export default function ImportModifications(p) {
  const dispatch = useDispatch()
  const [importProjectId, setImportProjectId] = React.useState()

  /**
   * Create modifications by copying from the selected project and then redirect
   * to the project's modification list page.
   */
  function _copyFromProject() {
    dispatch(
      copyFromProject({
        fromProjectId: importProjectId,
        regionId: p.regionId,
        toProjectId: p.projectId
      })
    ).then(() => {
      Router.push({
        pathname: RouteTo.modifications,
        query: {regionId: p.regionId, projectId: p.projectId}
      })
    })
  }

  return (
    <>
      <h5>{message('modification.importFromShapefile')}</h5>
      <ButtonLink
        block
        href={{
          pathname: RouteTo.importShapefile,
          query: {regionId: p.regionId, projectId: p.projectId}
        }}
        name={message('project.importAction')}
        style='success'
      >
        <Icon icon={faUpload} /> {message('project.importAction')}
      </ButtonLink>
      <br />
      <h5>{message('modification.importFromProject')}</h5>
      <p>{message('modification.importFromProjectInfo')}</p>
      <div className='form-group'>
        <Select
          clearable={false}
          getOptionLabel={p => p.name}
          getOptionValue={p => p._id}
          onChange={p => setImportProjectId(p._id)}
          options={p.projects}
          placeholder={message('project.select')}
          value={p.projects.find(p => p._id === importProjectId)}
        />
      </div>
      <Button
        block
        disabled={!importProjectId}
        name={message('project.importAction')}
        onClick={_copyFromProject}
        style='success'
      >
        <Icon icon={faCopy} /> {message('project.importAction')}
      </Button>
    </>
  )
}
