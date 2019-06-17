import React from 'react'

import {loadProject} from 'lib/actions/project'
import {load as loadRegion} from 'lib/actions/region'
import Dock from 'lib/components/inner-dock'
import ProjectTitle from 'lib/components/project-title'
import ImportShapefile from 'lib/components/import-shapefile'

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

ImportShapefilePage.getInitialProps = async ctx => {
  const store = ctx.reduxStore
  const {regionId, projectId} = ctx.query
  const [region, project] = await Promise.all([
    store.dispatch(loadRegion(regionId)),
    store.dispatch(loadProject(projectId))
  ])
  return {
    project,
    region
  }
}

export default ImportShapefilePage
