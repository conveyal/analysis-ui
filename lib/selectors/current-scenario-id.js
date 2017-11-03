// @flow
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

export default createSelector(
  selectActiveModification,
  state => state.scenario && state.scenario.currentScenario,
  (_, props = {}) => props.params,
  (activeModification = {}, currentScenario = {}, routeParams = {}) =>
    routeParams.scenarioId || activeModification.scenario || currentScenario.id
)
