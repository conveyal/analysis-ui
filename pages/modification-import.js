import React from 'react'

import {load as loadRegion} from 'lib/actions/region'
import Dock from 'lib/components/inner-dock'
import ProjectTitle from 'lib/components/project-title'
import ImportModifications from 'lib/components/import-modifications'

function ImportModificationsPage(p) {
  return (
    <>
      <ProjectTitle project={p.project} />
      <Dock className='block'>
        <ImportModifications
          projects={p.projects}
          projectId={p.projectId}
          regionId={p.regionId}
        />
      </Dock>
    </>
  )
}

ImportModificationsPage.getInitialProps = async ctx => {
  const store = ctx.reduxStore
  const {regionId, projectId} = ctx.query
  const {projects} = await store.dispatch(loadRegion(regionId))
  return {
    project: projects.find(p => p._id === projectId),
    projects: projects.filter(p => p._id !== projectId)
  }
}

export default ImportModificationsPage
