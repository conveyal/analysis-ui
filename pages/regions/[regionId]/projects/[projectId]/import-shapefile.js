import React from 'react'

import {loadProject} from 'lib/actions/project'
import {load as loadRegion} from 'lib/actions/region'
import Dock from 'lib/components/inner-dock'
import ProjectTitle from 'lib/components/project-title'
import ImportShapefile from 'lib/components/import-shapefile'
import withInitialFetch from 'lib/with-initial-fetch'

function ImportShapefilePage(p) {
  return (
    <>
      <ProjectTitle project={p.project} />
      <Dock className='block'>
        <ImportShapefile
          projectId={p.projectId}
          regionId={p.regionId}
          variants={p.project.variants}
        />
      </Dock>
    </>
  )
}

function initialFetch(store, query) {
  const {regionId, projectId} = query
  return Promise.all([
    store.dispatch(loadRegion(regionId)),
    store.dispatch(loadProject(projectId))
  ]).then(([region, project]) => ({project, region}))
}

export default withInitialFetch(ImportShapefilePage, initialFetch)
