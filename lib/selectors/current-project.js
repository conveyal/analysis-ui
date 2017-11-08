// @flow
import {createSelector} from 'reselect'

import selectCurrentProjectId from './current-project-id'
import selectProjects from './projects'

export default createSelector(
  selectCurrentProjectId,
  selectProjects,
  (_id, projects) => projects.find(p => p._id === _id)
)
