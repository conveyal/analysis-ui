// @flow
import {createSelector} from 'reselect'

import selectCurrentScenario from './current-scenario'

export default createSelector(
  (_, props = {}) => props.params,
  (state) => state.project && state.project.currentProjectId,
  selectCurrentScenario,
  (routeParams = {}, currentProjectId, currentScenario = {}) =>
    routeParams.projectId || currentProjectId || currentScenario.projectId
)
