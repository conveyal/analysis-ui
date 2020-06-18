import {createSelector} from 'reselect'

import get from 'lib/utils/get'

export default createSelector(
  (state) => get(state, 'analysis.requestsSettings[1].projectId'),
  (state) => get(state, 'project.projects'),
  (_id, projects = []) => projects.find((s) => s._id === _id)
)
