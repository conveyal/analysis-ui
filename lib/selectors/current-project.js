import {createSelector} from 'reselect'

import selectCurrentProjectId from './current-project-id'

export default createSelector(
  selectCurrentProjectId,
  (state) => state.project && state.project.projects,
  (_id, projects = []) => projects.find((s) => s._id === _id)
)
