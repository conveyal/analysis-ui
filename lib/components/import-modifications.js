import {Heading} from '@chakra-ui/core'
import {faCopy, faUpload} from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {copyFromProject} from 'lib/actions/modifications'
import message from 'lib/message'
import {routeTo} from 'lib/router'

import {Button, ButtonLink} from './buttons'
import H5 from './h5'
import Icon from './icon'
import P from './p'
import Select from './select'

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
      const {href, as} = routeTo('modifications', {
        regionId: p.regionId,
        projectId: p.projectId
      })
      Router.push(href, as)
    })
  }

  return (
    <>
      <Heading size='md' mb={4}>
        {message('modification.importFromShapefile')}
      </Heading>
      <ButtonLink
        to='importShapefile'
        projectId={p.projectId}
        regionId={p.regionId}
        block
        name={message('project.importAction')}
        style='success'
      >
        <Icon icon={faUpload} /> {message('project.importAction')}
      </ButtonLink>
      <br />
      <Heading size='md' mb={4}>
        {message('modification.importFromProject')}
      </Heading>
      <P>{message('modification.importFromProjectInfo')}</P>
      <div className='form-group'>
        <Select
          getOptionLabel={(p) => p.name}
          getOptionValue={(p) => p._id}
          onChange={(p) => setImportProjectId(p._id)}
          options={p.projects}
          placeholder={message('project.select')}
          value={p.projects.find((p) => p._id === importProjectId)}
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
