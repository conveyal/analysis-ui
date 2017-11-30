import {createSelector} from 'reselect'

import selectCurrentBundle from './current-bundle'

const projectHasMatchingBundle = ({
  bundleId,
  projectId,
  projects
}) => project => project.bundleId === bundleId && project._id !== projectId

export default createSelector(
  state => state.project.projects,
  (state, props) => props.params.projectId,
  selectCurrentBundle,
  (projects, projectId, bundle) => {
    if (bundle) {
      return projects
        .filter(projectHasMatchingBundle({bundleId: bundle._id, projectId}))
        .map(project => {
          return {value: project._id, label: project.name}
        })
    } else {
      return []
    }
  }
)
