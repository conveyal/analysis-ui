// @flow
import {createSelector} from 'reselect'

import selectCurrentProject from './current-project'

export default createSelector(
  selectCurrentProject,
  state => !!state.project.r5Versions,
  state => (state.project.r5Versions ? state.project.r5Versions.all : []),
  (project, areR5VersionsLoaded, r5Versions) =>
    project && project.r5Version && areR5VersionsLoaded && !r5Versions.includes(project.r5Version) // version is old, or has been removed from s3 due to some horrific bug
)
