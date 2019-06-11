import React from 'react'

import {loadProjectAndModifications} from 'lib/actions/project'
import List from 'lib/components/modification/list'

import SelectProject from './projects'

/**
 * Show Select Project if a project has not been selected
 */
function Modifications(p) {
  if (!p.projectId) {
    return <SelectProject {...p} />
  } else {
    return <List {...p} />
  }
}

/**
 * Populates props with bundle, feeds, modifications, and project.
 */
Modifications.getInitialProps = async ctx => {
  const {projectId} = ctx.query
  if (!projectId) return await SelectProject.getInitialProps(ctx)
  return await ctx.reduxStore.dispatch(loadProjectAndModifications(projectId))
}

export default Modifications
