// @flow
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

export default createSelector(
  selectActiveModification,
  (_, props) => props.params,
  (activeModification, routeParams) => activeModification
    ? activeModification.scenario
    : routeParams.scenarioId
)
