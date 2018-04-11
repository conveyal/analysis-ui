// @flow
import {createSelector} from 'reselect'

import selectBundlesReady from './bundles-ready'
import selectCurrentProject from './current-project'

export default createSelector(
  selectCurrentProject,
  selectBundlesReady,
  (project = {}, bundles) => bundles.find(b => b._id === project.bundleId)
)
