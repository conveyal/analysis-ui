// @flow
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

export default createSelector(
  selectActiveModification,
  state => state.project && state.project.currentProject,
  (_, props = {}) => props.params,
  (activeModification = {}, currentProject = {}, routeParams = {}) =>
    routeParams.projectId || activeModification.projectId || currentProject._id
)
