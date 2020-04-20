import {createSelector} from 'reselect'

import get from '../utils/get'

export default createSelector(
  (state) => get(state, 'analysis.displayedProfileRequest.projectId'),
  (state) => get(state, 'project.projects'),
  (_id, projects = []) => projects.find((s) => s._id === _id)
)
