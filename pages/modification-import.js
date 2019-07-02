import React from 'react'

import {load as loadRegion} from 'lib/actions/region'
import Dock from 'lib/components/inner-dock'
import ProjectTitle from 'lib/components/project-title'
import ImportModifications from 'lib/components/import-modifications'
import withFetch from 'lib/with-fetch'

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

async function fetchData(dispatch, query) {
  const {regionId, projectId} = query
  const {projects} = await dispatch(loadRegion(regionId))
  return {
    project: projects.find(p => p._id === projectId),
    projects: projects.filter(p => p._id !== projectId)
  }
}

export default withFetch(ImportModificationsPage, fetchData)
