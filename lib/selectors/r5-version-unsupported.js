import {createSelector} from 'reselect'

export default createSelector(
  state => !!state.project.currentProject,
  state =>
    state.project.currentProject ? state.project.currentProject.r5Version : '',
  state => !!state.project.r5Versions,
  state => (state.project.r5Versions ? state.project.r5Versions.all : []),
  (isProjectLoaded, r5Version, areR5VersionsLoaded, r5Versions) =>
    isProjectLoaded && areR5VersionsLoaded && !r5Versions.includes(r5Version) // version is old, or has been removed from s3 due to some horrific bug
)
