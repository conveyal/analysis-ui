// @flow
import {createSelector} from 'reselect'

import selectCurrentScenario from './current-scenario'

export default createSelector(
  selectCurrentScenario,
  scenario => (scenario ? scenario.variants : [])
)
