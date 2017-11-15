// @flow
import {createSelector} from 'reselect'

import selectCurrentScenario from './current-scenario'

export default createSelector(
  (_, props = {}) => props.params,
  (state) => state.region && state.region.currentRegionId,
  selectCurrentScenario,
  (routeParams = {}, currentRegionId, currentScenario = {}) =>
    routeParams.regionId || currentRegionId || currentScenario.regionId
)
