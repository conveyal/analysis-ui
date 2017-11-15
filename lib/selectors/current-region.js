// @flow
import {createSelector} from 'reselect'

import selectCurrentRegionId from './current-region-id'
import selectRegions from './regions'

export default createSelector(
  selectCurrentRegionId,
  selectRegions,
  (_id, regions) => regions.find(p => p._id === _id)
)
