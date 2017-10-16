// @flow
import {createSelector} from 'reselect'

import selectCurrentScenario from './current-scenario'

export default createSelector(
  selectCurrentScenario,
  state => state.scenario.bundles,
  (scenario, bundles) =>
    (scenario ? bundles.find(b => b.id === scenario.bundleId) : null)
)
