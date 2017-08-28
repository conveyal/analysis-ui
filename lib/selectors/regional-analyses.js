import {createSelector} from 'reselect'

import selectCurrentScenario from './current-scenario'

export default createSelector(
  [selectCurrentScenario, (state) => state.project.regionalAnalyses],
  (scenario, allAnalyses) => allAnalyses
    ? allAnalyses.filter(a => a.scenarioId === scenario.id && !a.deleted)
    : []
)
