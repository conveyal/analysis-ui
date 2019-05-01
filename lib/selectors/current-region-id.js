import {createSelector} from 'reselect'

import selectCurrentProject from './current-project'

export default createSelector(
  (_, props = {}) => props.query,
  state => state.region && state.region.currentRegionId,
  selectCurrentProject,
  (query = {}, currentRegionId, currentProject = {}) =>
    query.regionId || currentRegionId || currentProject.regionId
)
