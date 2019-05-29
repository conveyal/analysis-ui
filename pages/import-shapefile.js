import React from 'react'

import {loadProject} from 'lib/actions/project'
import {load as loadRegion} from 'lib/actions/region'
import {Application, Dock} from 'lib/components/base'
import ProjectTitle from 'lib/components/project-title'
import ImportShapefile from 'lib/components/import-shapefile'

function ImportShapefilePage(p) {
  return (
    <Application>
      <ProjectTitle project={p.project} />
      <Dock>
        <ImportShapefile
          projectId={p.projectId}
          regionId={p.regionId}
          variants={p.project.variants}
        />
      </Dock>
    </Application>
  )
}

ImportShapefilePage.getInitialProps = async ctx => {
  const store = ctx.reduxStore
  const {regionId, projectId} = ctx.query
  await store.dispatch(loadRegion(regionId))
  const project = store.dispatch(loadProject(projectId))
  return {
    project
  }
}

export default ImportShapefilePage
