// @flow
import {createSelector} from 'reselect'

import selectCurrentScenario from './current-scenario'

export default createSelector(
  (state) => state.project && state.project.currentProject,
  selectCurrentScenario,
  (_, props = {}) => props.params,
  (currentProject = {}, currentScenario = {}, routeParams = {}) =>
    routeParams.projectId || currentProject.id || currentScenario.projectId
)
