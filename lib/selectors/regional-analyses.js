import {createSelector} from 'reselect'

import selectCurrentProject from './current-project'

export default createSelector(
  [selectCurrentProject, state => state.region.regionalAnalyses],
  (project, allAnalyses) =>
    (allAnalyses
      ? allAnalyses.filter(a => a.projectId === project._id && !a.deleted)
      : [])
)
