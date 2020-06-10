import {createSelector} from 'reselect'

import get from '../utils/get'

import selectCurrentProjectId from './current-project-id'

export default createSelector(
  selectCurrentProjectId,
  (state) => get(state, 'project.projects'),
  (_id, projects = []) => projects.find((s) => s._id === _id)
)
