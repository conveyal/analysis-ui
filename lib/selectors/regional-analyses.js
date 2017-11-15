import {createSelector} from 'reselect'

import selectCurrentScenario from './current-scenario'

export default createSelector(
  [selectCurrentScenario, state => state.region.regionalAnalyses],
  (scenario, allAnalyses) =>
    (allAnalyses
      ? allAnalyses.filter(a => a.scenarioId === scenario._id && !a.deleted)
      : [])
)
