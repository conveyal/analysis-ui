// @flow
import {createSelector} from 'reselect'

export default createSelector(
  state => state.analysis.comparisonProjectId,
  state => state.project.projects,
  (comparisonProjectId, projects) =>
    projects.find(s => s._id === comparisonProjectId)
)
