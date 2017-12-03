// @flow
import {createSelector} from 'reselect'

import selectCurrentProject from './current-project'

export default createSelector(
  selectCurrentProject,
  state => state.project.bundles,
  (project = {}, bundles) => bundles.find(b => b._id === project.bundleId)
)
