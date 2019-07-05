import React from 'react'

import {loadProjectAndModifications} from 'lib/actions/project'
import {load} from 'lib/actions/region'
import List from 'lib/components/modification/list'
import SelectProject from 'lib/components/select-project'
import withFetch from 'lib/with-fetch'

const noProjectId = pid => !pid || pid === 'undefined'

/**
 * Show Select Project if a project has not been selected
 */
function Modifications(p) {
  if (noProjectId(p.query.projectId)) {
    return <SelectProject {...p} />
  } else {
    return <List {...p} />
  }
}

/**
 * Populates props with bundle, feeds, modifications, and project.
 */
function fetchData(dispatch, query) {
  const {projectId, regionId} = query
  if (noProjectId(projectId)) return dispatch(load(regionId))
  return dispatch(loadProjectAndModifications(projectId))
}

export default withFetch(Modifications, fetchData)
