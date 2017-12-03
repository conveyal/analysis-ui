// @flow
import {createSelector} from 'reselect'

import selectCurrentProject from './current-project'

export default createSelector(
  (_, props = {}) => props.params,
  (state) => state.region && state.region.currentRegionId,
  selectCurrentProject,
  (routeParams = {}, currentRegionId, currentProject = {}) =>
    routeParams.regionId || currentRegionId || currentProject.regionId
)
