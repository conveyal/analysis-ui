import React from 'react'

import {loadProjectAndModifications} from 'lib/actions/project'
import List from 'lib/components/modification/list'
import withFetch from 'lib/with-fetch'

import SelectProject, {fetchData as selectProjectFetchData} from './projects'

/**
 * Show Select Project if a project has not been selected
 */
function Modifications(p) {
  if (!p.query.projectId) {
    return <SelectProject {...p} />
  } else {
    return <List {...p} />
  }
}

/**
 * Populates props with bundle, feeds, modifications, and project.
 */
function fetchData(dispatch, query) {
  const {projectId} = query
  if (!projectId) return selectProjectFetchData(dispatch, query)
  return dispatch(loadProjectAndModifications(projectId))
}

export default withFetch(Modifications, fetchData)
